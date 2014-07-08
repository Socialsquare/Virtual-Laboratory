define([
    'base',
    'knockout',
    'utils/utils'
], function (Base, ko, utils) {
    var _nextId = 0;
    var nextId = function () {
        return _nextId++;
    };

    var InventoryItem = Base.extend({
        constructor: function (vals) {
            this.uid = ko.observable(nextId());
            this.type = ko.observable(vals.type || '');
            this.name = ko.observable(vals.name || '');
            this.content = ko.observable(vals.content || null);
            this.klass = ko.observable(vals.klass || '');
            this.icon = ko.observable(vals.icon || '');
        },

        clone: function () {
            return utils.klone(this);
        }
    });

    return InventoryItem;
});
