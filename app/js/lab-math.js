/**
 * Contains various calculation functions
 */
define([
], function() {
	return {
		getBiomassFromLogConcentration: getBiomassFromLogConcentration,
		getLogConcentrationFromBiomass: getLogConcentrationFromBiomass,
		getBaseLog: getBaseLog
	};

	function getBiomassFromLogConcentration(logConcentration) {
		return Math.pow(10, logConcentration - 12);
	}

	function getLogConcentrationFromBiomass(biomass) {
		return this.getBaseLog(10, biomass) + 12;
	}

	function getBaseLog(base, num) {
		return Math.log(num) / Math.log(base);
	}
});