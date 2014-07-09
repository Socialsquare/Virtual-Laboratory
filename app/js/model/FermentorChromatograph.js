define([
    'knockout',
    'base',
    'model/FermentorTank'
], function(ko, Base, FermentorTankModel) { // TODO "model" here?

    var FermentorChromatograph = Base.extend({ // TODO or "model" here??


        constructor: function () {
            var self = this;

            self.fermentorTank = new FermentorTankModel();
            // TODO fermentor-computer - should define the pH and temperature of the fermentor, and activate it.
            // TODO chromatograph - should be able to get some contents from the fermentor
        }
    });

    return FermentorChromatograph;
});
