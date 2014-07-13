define([
    'knockout',
    'model/SpecialItem',
    'model/type/SpecialItem'
], function (ko, SpecialItemModel, SpecialItemType) {

    var Scalpel = SpecialItemModel.extend({

        constructor: function (type) {
            var self = this;
            self.base(SpecialItemType.SCALPEL);
        }
    });

    return Scalpel;
});
