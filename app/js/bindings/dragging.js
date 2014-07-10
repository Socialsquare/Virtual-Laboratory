define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {
    var DRAG_DATA_ID = 'vlab.drag.data';

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
            var self = this;

            var options = valueAccessor();
            self.accept = options.accept || _.constant(true);
            self.handler = options.handler;

            $(element).droppable({
                tolerance: 'pointer',
                accept: function (draggable) {
                    return self.accept(dragData);
                },
                drop: function(evt, ui) {
                    self.handler(dragData);
                }
            });
        }
    };
});
