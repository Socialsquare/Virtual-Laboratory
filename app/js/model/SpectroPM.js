define([
    'knockout',
    'base',
    'model/SpectroPMMachine'
], function(ko, Base, SpectroPMMachineModel) {

    var SpectroPM = Base.extend({

        constructor: function () {
            var self = this;

            self.SpectroPMMachine = new SpectroPMMachineModel();

        }
    });

    return SpectroPM;
});