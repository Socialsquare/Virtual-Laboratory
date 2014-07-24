define([
    'jquery',
    'knockout'
], function ($, ko) {

    ko.bindingHandlers.foreachKV = {
        transformObject: function (obj) {
            var properties = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    properties.push({ key: key, value: obj[key] });
                }
            }
            return properties;
        },
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                properties = ko.bindingHandlers.foreachKV.transformObject(value);
            ko.applyBindingsToNode(element, { foreach: properties });
            return { controlsDescendantBindings: true };
        }
    };

});
