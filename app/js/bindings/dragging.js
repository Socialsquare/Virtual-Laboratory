define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {
    var dragData = null;

    ko.bindingHandlers.drag = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

            var options = valueAccessor();
            var item = valueAccessor();
            if (typeof options.dim !== 'undefined') {
                item = options.item;
            } else {
                options.dim = false;
            }

            $(element).draggable({
                containment: 'window',
                revert: 'invalid',
                zIndex: 100000,
                helper: 'clone',
                start: function (event, ui) {
                    if (options.dim)
                        $(this).fadeTo(0, 0.3);
                    dragData = item;
                },
                stop: function (event, ui) {
                    if (options.dim)
                        $(this).fadeTo(0, 1);
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
