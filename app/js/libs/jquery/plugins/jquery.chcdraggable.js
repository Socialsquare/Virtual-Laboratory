/**
 * RequireJS Plugin for jQuery that allows an element to be cross platform draggable. This means that it is mouse-touch agnostic.
 * @author Chris Hjorth, www.chrishjorth.com
 * @version: ALPHA 2014-04-25
 */
 
/** !DRAGGABLE
 * Turns a jQuery element into a draggable element that reacts to user interaction.
 */
define([
	'jquery'
], function($) {
	var CHC_EVENT_NAMESPACE = "chcEvent";
	var PLUGIN_NAME = "chcDraggable";
	var draggables = [];
	
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
	
	$.fn.chcDraggable = function(method) {
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
				returnToOriginalPosition: true,
				isDragging: false
			};

			$.extend(properties, options);
			
			$this.data(PLUGIN_NAME, {
				target: $this,
				properties: properties
			});

			_registerEvents($this);

			draggables.push($this);
		});
	}
	
	function destroy() {
		return this.each(function() {
			var $this = $(this),
				i = 0;
			$this.off('mousedown', handleMouseDown);
			$('body').off('mousemove', null, $this, handleMouseMove);
			$('body').off('mouseup', null, $this, handleMouseUp);
			$this.off('touchstart', handleTouchStart);
			$('body').off('touchmove', handleTouchMove);
			$('body').off('touchend', handleTouchEnd);
			while(i < draggables.length && !draggables[i].is($this)) {
				i++;
			}
			draggables.splice(i, 1);
			$this.removeData(PLUGIN_NAME);
		});
	}
	
	function returnToOriginalPosition(callback) {
		return this.each(function() {
			var $this = $(this);
			if($this.data(PLUGIN_NAME).properties.returnToOriginalPosition) {
				var originalPosition = _getOriginalPosition($this);
			
				//TODO: See if possible to convert to CSS transition
				$this.animate({
					left: originalPosition.offsetLeft,
					top: originalPosition.offsetTop
				}, 300, function() {
					$(originalPosition.container).append($this);
					$this.css({
						'position': originalPosition.position,
						'left': originalPosition.left,
						'top': originalPosition.top,
						'z-index': originalPosition.zIndex
					});
					$this.trigger("chcDraggableDroppedOut." + CHC_EVENT_NAMESPACE);
					if(callback) {
						callback();
					}
				});
			}
		});
	}
	
	//SETTERS & GETTERS
	function _setDragging($this, status) {
		var data = $this.data(PLUGIN_NAME);
		data.properties.isDragging = status;
		$this.data(PLUGIN_NAME, data);
	}
	
	function _isDragging($this) {
		var data = $this.data(PLUGIN_NAME);
		if(!data) {
			return false;
		}
		return data.properties.isDragging;
	}
	
	/**
	 * @param position = {top: int, left: int}
	 */
	function _setOriginalPosition($this, position) {
		var data = $this.data(PLUGIN_NAME);
		data.properties.originalPosition = position;
		$this.data(PLUGIN_NAME, data);
	}
	
	function _getOriginalPosition($this) {
		var data = $this.data(PLUGIN_NAME);
		return data.properties.originalPosition;
	}
	
	/**
	 * @param offset = {top: int, left: int}
	 */
	function _setOffset($this, offset) {
		var data = $this.data(PLUGIN_NAME);
		data.properties.offset = offset;
		$this.data(PLUGIN_NAME, data);
	}
	
	function _getOffset($this) {
		var data = $this.data(PLUGIN_NAME);
		return data.properties.offset;
	}
	
	/**
	 * @param interactionPoint = {x: int, y: int}; Absolute document position
	 */
	function _setLastInteractionPoint($this, lastInteractionPoint) {
		var data = $this.data(PLUGIN_NAME);
		data.properties.lastInteractionPoint = lastInteractionPoint;
		$this.data(PLUGIN_NAME, data);
	}
	
	function _getLastInteractionPoint($this) {
		var data = $this.data(PLUGIN_NAME);
		return data.properties.lastInteractionPoint;
	}

	//HELPERS
	function _registerEvents($this) {
		//Mouse device events
		$this.on('mousedown', handleMouseDown);
		$(document.body).on('mousemove', null, $this, handleMouseMove);
		$(document.body).on('mouseup', null, $this, handleMouseUp);
			
		//Touch device events
		$this.on('touchstart', handleTouchStart);
		$(document.body).on('touchmove', null, $this, handleTouchMove);
		$(document.body).on('touchend', null, $this, handleTouchEnd);
	}
	
	//DRAG METHODS
	/**
	 * @param interactionPoint = {x: int, y: int}; Absolute document position
	 */
	function _startDrag($this, interactionPoint) {
		var position = {};
		position.left = $this.css('left');
		position.top = $this.css('top');
		position.position = $this.css('position');
		position.zIndex = $this.css('z-index');
		//get absolute position
		var absolutePosition = $this.offset();
		position.offsetLeft = absolutePosition.left;
		position.offsetTop = absolutePosition.top;
		position.container = $this.parent();
		_setOriginalPosition($this, position);

		//We must trigger before extracting to body in order to support event bubbling in the starting DOM hierarchy
		$this.trigger("chcDraggableStart." + CHC_EVENT_NAMESPACE, [interactionPoint]);

		//Extract object to document root
		$(document.body).append($this);

		//Set CSS position to absolute and reposition
		$this.css({
			'position': 'absolute',
			'left': position.offsetLeft,
			'top': position.offsetTop,
			'z-index': 500
		});
		
		//Store offset from mouse touch point to object origin
		var offset = {
			left: interactionPoint.x - position.offsetLeft,
			top: interactionPoint.y - position.offsetTop
		};
		_setOffset($this, offset);
		
		_setLastInteractionPoint($this, interactionPoint);
		
		_setDragging($this, true);
	}
	
	function _drag($this, interactionPoint) {
		var offset = _getOffset($this);
		$this.css({
			'left': (interactionPoint.x - offset.left) + "px",
			'top': (interactionPoint.y - offset.top) + "px"
		});
		
		_setLastInteractionPoint($this, interactionPoint);
	}
	
	function _stopDrag($this) {
		_setDragging($this, false);
		$this.trigger("chcDraggableStop." + CHC_EVENT_NAMESPACE, [_getLastInteractionPoint($this)]);
	}

	//EVENT HANDLERS
	function handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		var point = {
			x: event.pageX,
			y: event.pageY
		};
		_startDrag($(this), point);
	} 

	function handleMouseMove(event) {
		if(_isDragging(event.data) === true) {
			event.preventDefault();
			event.stopPropagation();
			var point = {
				x: event.pageX,
				y: event.pageY
			};
			_drag(event.data, point);
		}
	}

	function handleMouseUp(event) {
		if(_isDragging(event.data)) {
			_stopDrag(event.data);
		}
	}

	function handleTouchStart(event) {
		var nativeEvent = event.originalEvent;
		if(nativeEvent.touches.length == 1) {
			var point = {
				x: nativeEvent.targetTouches[0].pageX,
				y: nativeEvent.targetTouches[0].pageY
			};
			_startDrag($(this), point);
		}
	}

	function handleTouchMove(event) {
		var i, $this;
		for(i = 0; i < draggables.length; i++) {
			$this = draggables[i];
			var nativeEvent = event.originalEvent;
			if(_isDragging($this) && nativeEvent.touches.length == 1) {
				var point = {
					x: nativeEvent.targetTouches[0].pageX,
					y: nativeEvent.targetTouches[0].pageY
				};
				_drag($this, point);
			}
		}
	}

	function handleTouchEnd(event) {
		var i, $this;
		for(i = 0; i < draggables.length; i++) {
			$this = draggables[i];
			if(_isDragging($this)) {
				_stopDrag($this);
			}
		}
		
	}
});
