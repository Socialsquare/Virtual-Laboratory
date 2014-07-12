define([
    'jquery',
    'knockout',
    'lodash',
    'utils/ImageHelper'
], function ($, ko, _, ImageHelper) {
    var dragData = null;
    var dragConsume = null;

    ko.bindingHandlers.drag = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

            var options = _.defaults(valueAccessor(), {
                dim: false,
                consume: _.noop
            });

            $(element).draggable({
                containment: 'window',
                revert: 'invalid',
                zIndex: 100000,
                appendTo: 'body',

                helper: function (event, ui) {
                    return $('<img/>').attr({ src: ImageHelper.draggingIcon(options.item) });
                },

                start: function (event, ui) {
                    if (options.dim)
                        $(this).addClass('dimmed');

                    dragData = options.item;
                    dragConsume = options.consume;
                },

                stop: function (event, ui) {
                    if (options.dim)
                        $(this).removeClass('dimmed');
                }
            });
        }
    };

    ko.bindingHandlers.drop = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

            var options = valueAccessor();

            var accept = options.accept || _.constant(true);
            var handler = options.handler;

            $(element).droppable({
                tolerance: 'pointer',

                accept: function (draggable) {
                    return accept(dragData);
                },

                drop: function(evt, ui) {
                    var accepted = handler(dragData);
                    if (accepted !== false)
                        dragConsume();
                }
            });
        }
    };
});
