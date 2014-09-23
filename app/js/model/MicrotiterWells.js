define([
    'knockout',
    'lodash',

    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/Well'
], function (ko, _, LiquidModel, LiquidType, ReactionCount, WellModel) {

    var MicrotiterWells = LiquidModel.extend({
        constructor: function (antigenCoatingType) { //TODO: antigenCoatingType ?
            var self = this;
            self.base(LiquidType.MICROTITER_WELLS, ReactionCount.NEVER, false);

            self.wells = ko.observableArray([]);

            for(var i = 0; i < 24; i++){
                self.wells.push(new WellModel());
            }

            self.isWellFluorescent = function (index) {
                 return self.wells()[index].hasFluorescentSecondaryAntibody();
            };

            self.clone = function() {
                var clone = new MicrotiterWells();
                clone.wells(_.invoke(self.wells(), 'clone'));

                return clone;
            };

            self.addFluorescentSecondaryAntibodies = function() {
                _.each(self.wells(), function(well) {
                    well.hasFluorescentSecondaryAntibody(true);
                });
            };

            self.clearWellsAntibodies = function() {
                _.each(self.wells(), function(well) {
                    well.hasAntibody(false);
                });
            };

            self.clearWellsSecondaryAntibodies = function(checkForAntibodies) {
                _.each(self.wells(), function(well) {
                    if (checkForAntibodies) {
                        if (!well.hasAntibody()) {
                            well.hasFluorescentSecondaryAntibody(false);
                        }
                    }else {
                        well.hasFluorescentSecondaryAntibody(false);
                    }
                });

            }

        }
    });

    return MicrotiterWells;
});

