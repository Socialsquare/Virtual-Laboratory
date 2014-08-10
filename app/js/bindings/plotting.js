define([
    'jquery',
    'knockout',
    'lodash'
], function ($, ko, _) {

    ko.bindingHandlers.plotFermentor = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());

            // data is an object.
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
                    }]
            });
        }
    };

    ko.bindingHandlers.plotDrugAffinity = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());

            var affinityData = data.affinityData;

            var plot = $.plot($(element), [
                /*{data: affinityData, label: 'TODO: concentration and affinity'}*/
                {data: affinityData}
            ], {
                xaxes: [{ min:-9, max: -3 }],
                yaxes: [{ min: 0, max: 100 }]
            });
        }
    };

    ko.bindingHandlers.plotMouse = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.unwrap(valueAccessor());

            var bloodGlucoseData = data.bloodData;
            var heartRateData = data.heartRateData;

            var plot = $.plot($(element), [
                {data: heartRateData, yaxis: 2, color: 'rgb(255,160,160)'},
                {data: bloodGlucoseData, label: 'mmol/L', yaxis: 1, color: 'yellow'}
                ], {
                xaxes: [{ show: false }],
                yaxes: [{ min: 0, max: 20 }, { min: -400, max: 1000, show: false}]
            });
        }
    };
});
