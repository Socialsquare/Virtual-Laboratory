define([
    'knockout',
    'base',
    'model/FermentorTank'
], function(ko, Base, FermentorTank) {

    var FermentorChromatographModel = Base.extend({


        constructor: function () {
            var self = this;

            self.tableSpacePetri = new FermentorTank();
            // TODO fermentor-computer - should define the pH and temperature of the fermentor, and activate it.
            // TODO chromatograph - should be able to get some contents from the fermentor
        }
    });

    return FermentorChromatographModel;
});
