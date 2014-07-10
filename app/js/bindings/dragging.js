define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {
    var dragData = null;

    ko.bindingHandlers.drag = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

            var item = valueAccessor();

            $(element).draggable({
                containment: 'window',
                revert: 'invalid',
                zIndex: 100000,
                helper: 'clone',
                start: function (event, ui) {
                    dragData = item;
                },
                appendTo: 'body'
            });
        }
    };

    ko.bindingHandlers.drop = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

            var options = valueAccessor();

            var accept = options.accept || _.constant(true);
            var handler = options.handler;

            $(element).droppable({
                tolerance: 'pointer',
                accept: function (draggable) {
                    return accept(dragData);
                },
                drop: function(evt, ui) {
                    handler(dragData);
                }
            });
        }
    };
});
