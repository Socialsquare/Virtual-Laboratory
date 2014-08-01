define([
    'knockout',
    'lodash',

    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/Well'
], function (ko, _, LiquidModel, LiquidType, ReactionCount, WellModel) {

    var MicrotiterWells = LiquidModel.extend({
        constructor: function (antigenCoatingType) {
            var self = this;
            self.base(LiquidType.MICROTITER_WELLS, ReactionCount.NEVER);

            self.wells = ko.observableArray([]);

            for(var i = 0; i < 24; i++){
                self.wells.push(new WellModel());
            }

            self.isWellFluorescent = function (index) {
                 return self.wells()[index].hasFluorescentSecondaryAntibody();
            };


        }
    });

    return MicrotiterWells;
});

