define([
    'knockout',
    'model/SpecialItem',
    'model/type/SpecialItem'
], function (ko, SpecialItemModel, SpecialItemType) {

    var Syringe = SpecialItemModel.extend({

        constructor: function (type) {
            var self = this;
            self.base(SpecialItemType.SYRINGE);
        }
    });

    return Syringe;
});
