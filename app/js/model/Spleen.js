define([
    'knockout',
    'model/SpecialItem',
    'model/type/SpecialItem'
], function (ko, SpecialItemModel, SpecialItemType) {

    var Spleen = SpecialItemModel.extend({

        constructor: function (type) {
            var self = this;
            self.base(SpecialItemType.SPLEEN);

            self.antibodiesFor = ko.observableArray([]);
        }
    });

    return Spleen;
});
