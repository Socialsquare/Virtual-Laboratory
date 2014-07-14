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
                consume: _.noop,
                offset: {
                    left: 40,
                    top: 40
                },
                revert: 'invalid',
                helper: function (event, ui) {
                    var item = dragData = _.isFunction(options.item) ? options.item() : options.item;
                    return $('<img/>').attr({ src: ImageHelper.draggingIcon(item) });;
                }
            });

            $(element).draggable({
                containment: 'window',
                revert: options.revert,
                zIndex: 100000,
                appendTo: 'body',
                cursorAt: options.offset,
                helper: options.helper,

                start: function (event, ui) {
                    if (options.dim)
                        $(this).addClass('dimmed');

                    dragData = _.isFunction(options.item) ? options.item() : options.item;
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
                    var accepted = handler(dragData, dragConsume);
                    if (accepted !== false)
                        dragConsume();
                }
            });
        }
    };
});
