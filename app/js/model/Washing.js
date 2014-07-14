define([
    'knockout',
    'base',
    'model/WashingTank',
    'model/TubeRack'

], function(ko, Base, WashingTankModel, TubeRackModel) {

    var Washing = Base.extend({

        constructor: function () {
            var self = this;
            self.washingTank = new WashingTankModel();
            // TODO: Ask for the user to choose a level of dilution

            self.tubeRack = new TubeRackModel();
        }
    });

    return Washing;
});
