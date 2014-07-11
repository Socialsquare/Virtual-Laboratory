define([
    'knockout',
    'base'
], function (ko, Base) {
    var ChemicalItemModel = Base.extend({
        constructor: function (name, item) {
            var self = this;

            self.name = ko.observable(name);
            self.item = ko.observable(item);
        }
    });

    return ChemicalItemModel;
});
