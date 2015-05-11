import ko = require('knockout');
import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import ProducedEnzymeModel = require('model/ProducedEnzyme');

import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');

import ReactionCount = require('model/ReactionCount');
import Utils = require('utils/utils');

class Microorganism extends LiquidModel {

    public microorganismType: KnockoutObservable<MicroorganismType>;
    public subtype: KnockoutObservable<MicroorganismType>;

    public living: KnockoutObservable<boolean>;
	public name: KnockoutObservable<string>;
	public extraGenes: KnockoutObservableArray<any>;
    public extraProperties: KnockoutObservableArray<any>;
	public optimalPh: KnockoutObservable<number>;
	public optimalTemp: KnockoutObservable<number>;
	public concentration: KnockoutObservable<number>;
    public producedEnzymes: KnockoutObservableArray<ProducedEnzymeModel>;

    constructor(microorganismType) {
        super(LiquidType.MICROORGANISM, ReactionCount.ALWAYS, true);

        // TODO! derp duplicates?
        this.microorganismType = ko.observable(microorganismType);
        this.subtype = ko.observable(microorganismType);

        this.living = ko.observable(true);
		this.name = ko.observable('');
		this.extraGenes = ko.observableArray([]);
        this.extraProperties = ko.observableArray([]);
		this.optimalPh = ko.observable(0);
		this.optimalTemp = ko.observable(0);
		this.concentration = ko.observable(0);
        this.producedEnzymes = ko.observableArray([]);

        ko.rebind(this);
    }

    addGene(gene) {
        this.extraGenes.push(gene);
    }

    getGrowthRate(ph, temperature) {

        return this.getPhGrowthFactor(ph) * this.getTempGrowthFactor(temperature) * 0.6; // TODO: optimize this magic number when the fermentor has plotting-implemented
    }

    grow(growthAmount) {
        this.concentration(this.concentration() + growthAmount);
    }

    getGrowthStep(deltaTime, containerMaxConc, containerPrevTotalConc, ph, temperature) {

        if (!this.living()) {
            return 0;
        }

        // Returns concentration
        // Temporarily converts to biomass (has the real unit g/L)
        // And back to concentration afterwards!
        var a_i = this.getGrowthRate(ph, temperature);
        var n_i = Utils.math.getBiomassFromConcentration(this.concentration()); //This _is_ the previous, as it is not updated until afterwards
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
        var dN_i_concentration = Utils.math.getConcentrationFromBiomass(dN_i);
        // I know this is lame, but it's _slightly_ better for readability
        return dN_i_concentration;
    }

    getPhGrowthFactor(ph) {
        var phDiff = ph - this.optimalPh();
        if(Math.abs(phDiff) >= 2) {
            this.living(false);
            return 0;
        }

        return 1 - 1.0/4.0 * phDiff * phDiff;
    }

    //TODO
    getTempGrowthFactor(temperature) {
        var tempDiff = temperature - this.optimalTemp();
        if (tempDiff > 8) //tempDiff = [8; Inf]
        {
            this.living(false); //TODO: let knockout track this state instead of having it in a getter
            return 0;
        }
        else if (tempDiff > 0) //tempDiff = [0;8]
        {
            return 1 - 1.0/64.0 * tempDiff*tempDiff;
        }
        else if (tempDiff < -20) //tempDiff = [-Inf; -20]
        { // "Frozen", just survive and wait for better times
            return 0;
        } else { //tempDiff = [-20;0]
            return 1 + tempDiff / 20.0;
        }
    }

    hashCode() {
        var geneHash = _.map(this.extraGenes(), (gene) => {
            return gene.hashCode();
        }).join(',');

        var propHash = _.map(this.extraGenes(), (prop) => {
            return prop.hashCode();
        }).join(',');

        return this._hashCode()
            + ':' + this.microorganismType()
            + ':' + this.living()
            + ':' + geneHash
            + ':' + propHash
            + ':' + this.optimalPh()
            + ':' + this.optimalTemp();
    }

    clone() {
        var clone = new Microorganism(this.microorganismType());

        clone.hasReacted(this.hasReacted());

        clone.living(this.living());
		clone.name(this.name());
		clone.extraGenes(_.invoke(this.extraGenes(), 'clone'));
        clone.extraProperties(_.invoke(this.extraProperties(), 'clone'));
		clone.optimalPh(this.optimalPh());
		clone.optimalTemp(this.optimalTemp());
		clone.concentration(this.concentration());
        clone.producedEnzymes(_.invoke(this.producedEnzymes(), 'clone'));

        return clone;
    }
}

export = Microorganism;
