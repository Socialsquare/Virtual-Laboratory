define([
    'knockout',
    'base',
    'model/WashingTank'
], function(ko, Base, WashingTankModel) {
    var Washing = Base.extend({ //TODO: this is a view.
        constructor: function () {
            var self = this;
            self.washingTank = new WashingTankModel();
            // TODO: Ask for the user to choose a level of dilution
        }
    });

    return Washing;
});

