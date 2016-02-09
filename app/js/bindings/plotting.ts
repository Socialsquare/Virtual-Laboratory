import $ = require('jquery');
import ko = require('knockout');

ko.bindingHandlers.plotFermentor = {
    // init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.unwrap(valueAccessor());

        // data is an object.
        var substrateData = data.substrate;
        var biomassData = data.biomass;
        var productData = data.product;
        $.plot(
            $(element),
            [
                { data: biomassData, label: 'Biomasse', yaxis: 1 },
                { data: substrateData, label: 'Substrat', yaxis: 1 },
                { data: productData, label: 'Produkt', yaxis: 2 }
            ],
            {
                xaxes: [{ show: false }],
                yaxes: [
                    { min: 0, max: 20 },
                    { min: 0, max: 1.5 }
                ]
            });
    }
};

ko.bindingHandlers.plotDrugAffinitySmall = {
    // init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.unwrap(valueAccessor());

        var affinityData = data.affinityData;

        /*{data: affinityData, label: 'TODO: concentration and affinity'}*/
        $.plot(
            $(element),
            [{ data: affinityData }],
            {
                xaxis: { min: -9, max: -3,  show: false },
                yaxis: { min:  0, max: 100, show: false }
            });
    }
};

ko.bindingHandlers.plotDrugAffinity = {
    // init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.unwrap(valueAccessor());

        var affinityData = data.affinityData;

        /*{data: affinityData, label: 'TODO: concentration and affinity'}*/
        $.plot(
            $(element),
            [{ data: affinityData }],
            {
                xaxis: { min: -9, max: -3 },
                yaxis: { min:  0, max: 100 }
            });
    }
};

ko.bindingHandlers.plotVetMonitor = {
    // init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.unwrap(valueAccessor());

        $.plot(
            $(element),
            data,
            {
                xaxes: [{ show: false }],
                yaxes: [
                    { min: 0, max: 20, },
                    { min: 0, max: 1,
                      alignTicksWithAxis: 1,
                      position: "right"
                    },
                    { min: -400, max: 1000, show: false, position: "right"}
                ]
            });
    }
};
