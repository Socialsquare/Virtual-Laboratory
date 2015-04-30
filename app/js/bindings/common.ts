import ko = require('knockout');

// Helper
var transformObject = function (obj) {
    var properties = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            properties.push({ key: key, value: obj[key] });
        }
    }
    return properties;
};

ko.bindingHandlers.foreachKV = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
        properties = transformObject(value);
        ko.applyBindingsToNode(element, { foreach: properties });
        return { controlsDescendantBindings: true };
    }
};
