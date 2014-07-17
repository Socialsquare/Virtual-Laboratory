define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {

    ko.bindingHandlers.plotFermentor = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // var options = valueAccessor();
            // $(element).chcDraggableSpawner(options);
        },

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());

            //TODO: dataTest is an object.
            var substrateData = data.substrate;
            var biomassData = data.biomass;
            var productData = data.product;
            var plot = $.plot($(element), [{data: biomassData, label: 'Biomasse', yaxis:1},
                {data: substrateData, label: 'Substrat', yaxis:1},
                {data: productData, label: 'Produkt', yaxis: 2}], {
                xaxes: [{ show: false }],
                yaxes: [{ min: 0, max: 20 },
                    {
                        // align if we are to the right
                        /*alignTicksWithAxis: 1, //position == "right" ? 1 : null,*/
                        min: 0, max: 1.5
                        /*position: position,
                        tickFormatter: euroFormatter*/
                    }]
            });
        }
    };

    ko.bindingHandlers.plotMouse = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // var options = valueAccessor();
            // $(element).chcDraggableSpawner(options);
        },

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var bloodGlucoseData = ko.unwrap(valueAccessor());

            var plot = $.plot($(element), [{data: bloodGlucoseData, label: 'mmol/L'}], {
             yaxis: { min: 0, max: 15 },
             xaxis: { show: false }
             });
        }
    };
});
