/**
 * RequireJS Plugin for jQuery that allows an element to be cross platform droppable. This means that it is mouse-touch agnostic.
 * @author Chris Hjorth, www.chrishjorth.com
 * @version: ALPHA 2014-04-17
 */
 
/**
 * DROPPABLE
 * Turns a jQuery element into a droppable element that reacts to interposed Draggables with whom the user stopped interaction.
 * Droppable only fires events. The consequences must be handles elsewere.
 */

 //TODO: Rewrite this class so that the functions are not static like. Right now destroying a droppable risks affecting remaining droppables
define([
	'jquery'
], function($) {
	var CHC_EVENT_NAMESPACE = "chcEvent";
	var PLUGIN_NAME = "chcDroppable";
	var droppables = [];
	var isDragStopHandlerInitialized = false;
	
	var methods = {
		init: function(options) {
			return init.apply(this, arguments);
		},
		destroy: function() {
			return destroy.apply(this);
		}
	};
	
	$.fn.chcDroppable = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME);
		}
	};
	
	//PUBLIC METHODS
	function init(options) {
		if(isDragStopHandlerInitialized === false) {
			$(document.body).on('chcDraggableStop.' + CHC_EVENT_NAMESPACE, '.draggable', null, handleDragStop);
			isDragStopHandlerInitialized = true;
		}

		return this.each(function() {
			var $this = $(this);
			
			if($this.data(PLUGIN_NAME)) {
				//This is already initialized
				return;
			}
			
			$this.data(PLUGIN_NAME, {});
			droppables.push($this);
		});
	}
	
	function destroy() {
		return this.each(function() {
			var $this = $(this),
				counter = 0;
			while(counter < droppables.length) {
				if($this.is(droppables[counter])) {
					droppables.splice(counter, 1);
				}
				counter++;
			}
			$this.removeData(PLUGIN_NAME);
		});
	}

	//EVENT HANDLERS
	/**
	 * This function is valid for all droppables since it is attached to document.body
	 * We loop in reverse order so that the latest droppables get evaluated first. The assumption is that they will be placed on top.
	 */
	function handleDragStop(event, stopPoint) {
		var $draggable = $(this);
		var counter = droppables.length - 1;
		var hit = false;
		while(counter >= 0 && hit === false) {
			var position = droppables[counter].offset();
			var isTarget = (stopPoint.x >= position.left && stopPoint.y >= position.top && stopPoint.x <= (position.left + droppables[counter].width()) && stopPoint.y <= (position.top + droppables[counter].height()));
			if(isTarget) {
				$draggable.trigger('chcDraggableDropped.' + CHC_EVENT_NAMESPACE);
				droppables[counter].trigger("chcDroppableDrop." + CHC_EVENT_NAMESPACE, [$draggable]);
				hit = true;
			}
			counter--;
		}

		if(hit === false) {
			//The draggable was dropped outside of any droppables
			$draggable.chcDraggable('returnToOriginalPosition');
		}	
	}
});