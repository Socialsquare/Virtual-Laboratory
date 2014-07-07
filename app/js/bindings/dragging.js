define([
    'jquery',
    'knockout'
], function ($, ko) {
    ko.bindingHandlers.dragSpawner = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options = valueAccessor();
            $(element).chcDraggableSpawner(options);
        }
    };

    ko.bindingHandlers.draggable = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options = valueAccessor();
            $(element).chcDraggable();
            $(element).on('chcDraggableStart.chcEvent', options.startHandler);
			$(element).on('chcDraggableDroppedOut.chcEvent', options.droppedHandler);
			$(element).on('chcDraggableSpawnDroppedOut.chcEvent', options.spawnDroppedHandler);
        }
    };

    ko.bindingHandlers.droparea = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var handler = valueAccessor();
            $(element).chcDroppable();
            $(element).on('chcDroppableDrop.chcEvent', handler);
        }
    };
});
