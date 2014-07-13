define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {

    ko.bindingHandlers.plot = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // var options = valueAccessor();
            // $(element).chcDraggableSpawner(options);
        },

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());

            var plot = $.plot($(element), [data], {
	            yaxis: { min: 0, max: 15 },
	            xaxis: { show: false }
            });
        }
    };
});
