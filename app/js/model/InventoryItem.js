define([
    'base',
    'knockout'
], function (Base, ko) {
    var InventoryItem = Base.extend({
        constructor: function (type, value) {
            this.type = ko.observable(type);
            this.value = ko.observable(value);
        }
    });

    return InventoryItem;
});
