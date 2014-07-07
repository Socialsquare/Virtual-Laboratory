define([
    'base',
    'knockout'
], function (Base, ko) {
    var InventoryItem = Base.extend({
        constructor: function (vals) {
            this.type = ko.observable(vals.type || '');
            this.name = ko.observable(vals.name || '');
            this.content = ko.observable(vals.content || null);
            this.klass = ko.observable(vals.klass || '');
            this.icon = ko.observable(vals.icon || '');
        }
    });

    return InventoryItem;
});
