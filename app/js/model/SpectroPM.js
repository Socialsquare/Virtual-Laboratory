define([
    'knockout',
    'base',
    'model/SpectroPMMachine'
], function(ko, Base, SpectroPMMachineModel) {

    var SpectroPM = Base.extend({
        //TODO: remove inline CSS from $this.ko

        constructor: function () {
            var self = this;

            self.spectroPMMachine = new SpectroPMMachineModel();

            self.reset = function () {
                self.spectroPMMachine.removeAll();
            };
        }
    });

    return SpectroPM;
});
