define([
    'knockout',
    'base'
], function (ko, Base) {
    var ChemicalItemModel = Base.extend({
        constructor: function (name, itemGetter) {
            var self = this;

            self.name = ko.observable(name);
            self.itemGetter = itemGetter;
            self.item = ko.observable(itemGetter());
        }
    });

    return ChemicalItemModel;
});
