import $ = require('jquery');
import ko = require('knockout');
import _ = require('lodash');

import ImageHelper = require('utils/ImageHelper');

var dragData = null;
var dragConsume = null;

type DragOptions = {
    item?: any; //TODO! type
    dim: boolean;
    consume: () => void;
    offset: {
        left: number;
        top: number
    },
    revert: string;
    hide: boolean;
    helper: (event, ui) => JQuery
};

ko.bindingHandlers.drag = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

        var options = <DragOptions>valueAccessor();

        var defaults = {
            dim: false,
            consume: _.noop,
            offset: {
                left: 40,
                top: 40
            },
            revert: 'invalid',
            hide: false,
            helper: function (event, ui) {
                var item = dragData = _.isFunction(options.item) ? options.item() : options.item;
                return $('<img/>').attr({ src: ImageHelper.draggingIcon(item) });
            }
        };

        options = <DragOptions>_.defaults(valueAccessor(), defaults);

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
                else if (options.hide)
                    $(this).addClass('hidden');

                dragData = _.isFunction(options.item) ? options.item() : options.item;
                dragConsume = options.consume;
            },

            stop: function (event, ui) {
                if (options.dim)
                    $(this).removeClass('dimmed');
                else if (options.hide)
                    $(this).removeClass('hidden');
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

            drop: function(event, ui) {
                // if dragData is null the data was already
                // dropped elsewhere and this drop is probably the
                // result of an overlapping drop area
                if (!dragData) return;
                debugger;
                var accepted = handler(dragData, dragConsume);
                if (accepted !== false)
                    dragConsume();

                dragData = null;
            }
        });
    }
};
