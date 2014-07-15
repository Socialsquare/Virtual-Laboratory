define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
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
		    self.extraGenes = ko.observable(null); //TODO: implement
            self.extraProperties = ko.observable(null); //TODO: implement
		    self.optimalPh = ko.observable(0);
		    self.optimalTemp = ko.observable(0);
		    self.concentration = ko.observable(0);



            self.addGene = function(gene) {
                self.extraGenes.push(gene);
            };

            self.addExtraProperties = function(properties) {

            };

            self.getGrowthRate = function(ph, temperature) {

                return self.getPhGrowthFactor(ph) * self.getTempGrowthFactor(temperature) * 0.6; // TODO: optimize this magic number when the fermentor has plotting-implemented
            };

            self.grow = function(growthAmount){
                self.concentration(self.concentration() + growthAmount);
            };

            self.getGrowthStep = function(deltaTime, containerMaxConc, containerPrevTotalConc, ph, temperature) {

                if(!self.living())  {return 0;}
// TODO: kill if conditions are too harsh

                // Returns concentration
                // Temporarily converts to biomass (has the real unit g/L)
                // And back to concentration afterwards!
                var a_i = self.getGrowthRate(ph, temperature);
                var n_i = Utils.math.getBiomassFromConcentration(self.concentration()); //This _is_ the previous, as it is not updated until afterwards
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
                return dN_i_concentration; // I know this is lame, but it's _slightly_ better for readability
            };

            self.getPhGrowthFactor = function(ph) {
                var phDiff = ph - self.optimalPh();
                if(Math.abs(phDiff) >= 2)
                {
                    self.living(false);
                    return 0;
                }

                return 1 - 1.0/4.0 * phDiff * phDiff;
            };

            self.getTempGrowthFactor = function(temperature) { //TODO
                var tempDiff = temperature - self.optimalTemp();
                if (tempDiff > 8) //tempDiff = [8; Inf]
                {
                    self.living(false); //TODO: let knockout track this state instead of having it in a getter
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
