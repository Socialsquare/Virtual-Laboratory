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

    ko.bindingHandlers.droparea = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options = valueAccessor();
            $(element).chcDroppable();
            $(element).on('chcDroppableDrop.chcEvent', options.handler);
        }
    };
});
