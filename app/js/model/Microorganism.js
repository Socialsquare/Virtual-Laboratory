define([
    'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
    'utils/utils'
], function(ko, LiquidModel, LiquidType, ReactionCount, Utils) {

    var Microorganism = LiquidModel.extend({
        constructor: function (microorganismType) {
            var self = this;
            self.base(LiquidType.MICROORGANISM, ReactionCount.NEVER);

            self.microorganismType = ko.observable(microorganismType);
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

            self.grow = function(growthAmount){
                self.concentration(self.concentration + growthAmount);
            };

            self.getGrowthStep = function(deltaTime, containerMaxConc, containerPrevTotalConc, pH, temperature) {
                // Returns concentration
                // Temporarily converts to biomass (has the real unit g/L)
                // And back to concentration afterwards!
                var a_i = self.getGrowthRate(pH, temperature);

                var n_i = Utils.math.getBiomassFromConcentration(self.concentration()); //This _is_ the previous, as it is not updated until afterwards
                /*var k = Math.pow(10, container.maxConcentration()) * 1.01;
                var n = container.getTotalConcentration();*/

                var k = Utils.math.getBiomassFromConcentration(containerMaxConc * 1.01); // Logarithmic asymptotic max-level
                var n = Utils.math.getBiomassFromConcentration(containerPrevTotalConc);

                // Formula:

                // dN_i = a_i * N_i * (K - N) / K // Logarithmic growth
                // a_i = growthRate;
                // dt = timeStep
                // n_i = biomass of the microorganism
                // n = total biomass
                // k = max-biomass * 1.01 (artifact when approaching something asymptotically)

                var dN_i = a_i * n_i * (k - n) / k * deltaTime;
                // Converts back to actual concentration
                dN_i_concentration = Utils.math.getConcentrationFromBiomass(dN_i);
                return dN_i_concentration; // I know this is lame, but its _slightly_ better for readability
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
