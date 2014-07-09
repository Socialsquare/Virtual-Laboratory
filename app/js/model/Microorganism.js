define([
    'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
    'model/MicroorganismType',
    'utils/utils'
], function(ko, LiquidModel, LiquidType, ReactionCount, MicroorganismType, Utils) {

    var Microorganism = LiquidModel.extend({
        constructor: function (microorganismType) {
            var self = this;
            self.base(LiquidType.MICROORGANISM, ReactionCount.NEVER);

            self.type = ko.observable(microorganismType);
            self.living = ko.observable(true);
		    self.name = ko.observable('');
		    self.extraGenes = ko.observable(null);
            self.extraProperties = ko.observable(null);
		    self.optimalpH = ko.observable(0);
/*		    self.maxpH = ko.observable(0);
		    self.minpH = ko.observable(0);*/
		    self.optimalTemp = ko.observable(0);
/*		    self.minTemp = ko.observable(0);
		    self.maxTemp = ko.observable(0);*/
		    self.concentration = ko.observable(0);

            self.getGrowthRate = function(pH, temperature) {
                if(!self.living())
                {return 0;}

                return self.getPHGrowthFactor() * self.getTempGrowthFactor() * 0.6;
            };

            self.getBiomass = function(){
                return self.concentration() / Math.pow(10,12);
            };

            self.growthStep = function(dt, container) {
                // TODO convert to Biomass!!! (has the real unit g/L)
                var a_i = self.getGrowthRate();
                var n_i = self.concentration();
                var k = Math.pow(10, container.maxConcentration()) * 1.01;
                var n = container.getTotalConcentration();

                // Formula:

                // dN_i = a_i * N_i * (K - N) / K // Logarithmic growth
                // a_i = growthRate;
                // dt = timeStep
                // n_i = concentration of the microorganism
                // n = total concentration
                // k = max-concentration * 1.01 (artifact when approaching something asymptotically)

                var dN_i = a_i * n_i * (k - n) / k;


                throw 'TODO'; // TODO
                return dN_i; // I know this is lame, but its _slightly_ better for readability

                // TODO limit when reaches maxConcentration

            };

            self.getPHGrowthFactor = function(pH) {
                var pHDiff = pH - self.optimalpH();
                if(Math.abs(pHDiff) >= 2)
                {
                    self.living(false);
                    return 0;
                }

                return 1 - 1.0/4.0 * pHDiff * pHDiff;
            };

            self.getTempGrowthFactor = function(temp) { //TODO
                var tempDiff = temp - self.optimalTemp();
                if (tempDiff > 8) //tempDiff = [8; Inf]
                {
                    self.living(false);
                    return 0;
                }
                else if(tempDiff > 0) //tempDiff = [0;8]
                {
                    return 1 - 1.0/64.0 * tempDiff*tempDiff;
                }
                else if(tempDiff < -20) //tempDiff = [-Inf; -20]
                { // "Frozen", just survive and wait for better times
                    return 0;
                }else{ //tempDiff = [-20;0]
                    return 1 + tempDiff / 20.0;
                }
            };
        }
    });

    return Microorganism;
});
