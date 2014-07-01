/**
 * RequireJS Plugin for jQuery that allows an element spawn a draggable.
 * This is for situations where starting a drag interaction on an object creates another object to be dragged while the original remains in place.
 * @author Chris Hjorth, www.chrishjorth.com
 * @version: ALPHA 2014-04-15
 */
 
/** DRAGGABLE SPAWNER
 * Turns a jQuery element into a draggable element that reacts to user interaction.
 */
define([
	'jquery',
	'chcdraggable'
], function($, chcDraggable) {
	var CHC_EVENT_NAMESPACE = "chcEvent";
	var PLUGIN_NAME = "chcDraggableSpawner";
	
	var methods = {
		init: function(options) {
			return init.apply(this, arguments);
		},
		destroy: function() {
			return destroy.apply(this);
		},
		returnToOriginalPosition: function(options) {
			return returnToOriginalPosition.apply(this, arguments);
		}
	};
	
	$.fn.chcDraggableSpawner = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME);
		}
	};

	//PUBLIC METHODS
	function init(options) {
		return this.each(function() {
			var $this = $(this);
			
			if($this.data(PLUGIN_NAME)) {
				//This is already initialized
				return;
			}
			
			//Set default options
			var properties = {
				styleClass: '',
				spawnHTML: '',
				content: null,
				additionalClasses: ''
			};

			$.extend(properties, options);
			
			$this.data(PLUGIN_NAME, {
				target: $this,
				properties: properties
			});

			_registerEvents($this);
		});
	}

	function destroy() {
		return this.each(function() {
			var $this = $(this);
			_unregisterEvents($this);
			$this.removeData(PLUGIN_NAME);
		});
	}

	//EVENTS
	function _registerEvents($this) {
		//Mouse device events
		$this.on('mousedown', handleMouseDown);
			
		//Touch device events
		$this.on('touchstart', handleTouchStart);
	}

	function _unregisterEvents($this) {
		//Mouse device events
		$this.off('mousedown', handleMouseDown);
			
		//Touch device events
		$this.off('touchstart', handleTouchStart);
	}

	function handleMouseDown(event) {
		var $this = $(this);
		var interactionPoint = {
			x: event.pageX,
			y: event.pageY
		};
		_spawnDraggable($this, interactionPoint);
	}

	function handleTouchStart(event) {
		var nativeEvent = event.originalEvent;
		if(nativeEvent.touches.length == 1) {
			var interactionPoint = {
				x: nativeEvent.targetTouches[0].pageX,
				y: nativeEvent.targetTouches[0].pageY
			};
			var $this = $(this);
			_spawnDraggable($this, interactionPoint);
		}
	}

	function handleSpawnDroppedOut(event) {
		event.data.trigger('chcDraggableSpawnDroppedOut.chcEvent');
		$(this).remove();
	}

	function _spawnDraggable($this, interactionPoint) {
		var $spawn = $this.clone();
		if($this.data(PLUGIN_NAME).properties.spawnHTML !== '') {
			$spawn.html($this.data(PLUGIN_NAME).properties.spawnHTML);
		}
		else {
			$spawn.css({
				'width': $this.width() + 'px',
				'height': $this.height() + 'px'
			});
		}
		$spawn.removeClass('draggablespawner');
		$spawn.addClass('draggablespawn draggable ' + $this.data(PLUGIN_NAME).properties.styleClass + ' ' + $this.data(PLUGIN_NAME).properties.additionalClasses);

		var $img = $spawn.find('img');
		if($img.length > 0) {
			var $imgParent = $img.parent();
			$imgParent.append('<div class="draggablespawn-imgdragfix" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></div>');
		}

		//We must trigger before extracting to body in order to support event bubbling in the starting DOM hierarchy
		$spawn.trigger("chcDraggableStart." + CHC_EVENT_NAMESPACE, [interactionPoint]);

		$('body').append($spawn);

		//We need to make sure DOM has updated to get correct width
		setTimeout(function() {
			var originalPosition = {};
			originalPosition.left = $this.position().left;
			originalPosition.top = $this.position().top;
			originalPosition.position = $this.css('position');
			originalPosition.zIndex = $this.css('z-index');
			originalPosition.offsetLeft = interactionPoint.x - ($spawn.width() / 2);
			originalPosition.offsetTop = interactionPoint.y - ($spawn.height() / 2);
			originalPosition.container = $this.parent();

			_convertToDraggable($this, originalPosition, $spawn, interactionPoint);
		}, 1);
	}

	function _convertToDraggable($this, originalPosition, $spawn, interactionPoint) {
		var offset, content;

		offset = {
			left: interactionPoint.x - originalPosition.offsetLeft,
			top: interactionPoint.y - originalPosition.offsetTop
		};

		$spawn.css({
			'position': 'absolute',
			'left': originalPosition.offsetLeft,
			'top': originalPosition.offsetTop,
			'z-index': 1000
		});

		content = $this.data(PLUGIN_NAME).properties.content;
		if(content !== null) {
			$spawn.data('content', content.clone());
		}
		
		$spawn.chcDraggable({isDragging: true, originalPosition: originalPosition, offset: offset, lastInteractionPoint: interactionPoint});
		$spawn.on('chcDraggableDroppedOut.chcEvent', null, $this, handleSpawnDroppedOut);
		$this.trigger('chcDraggableSpawned.chcEvent');
	}
});
