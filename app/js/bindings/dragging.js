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
			$(element).on('chcDraggableDroppedOut.chcEvent', options.droppedOutHandler);
			$(element).on('chcDraggableSpawnDroppedOut.chcEvent', options.spawnDroppedOutHandler);
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
