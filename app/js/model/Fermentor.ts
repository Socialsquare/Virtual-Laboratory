import ko = require('knockout');

import utils = require('utils/utils');

import FermentorTankModel = require('model/FermentorTank');
import ProducedEnzymeModel = require('model/ProducedEnzyme');

import GrowerType = require('model/type/Grower');
import LiquidType = require('model/type/Liquid');
import LocationType = require('model/type/Location');


class Fermentor {

    public fermentorTank: FermentorTankModel;
    public temperature: KnockoutObservable<number>;
    public ph: KnockoutObservable<number>;
    public timer: KnockoutObservable<number>;
    public hourResolution: KnockoutObservable<number>;
    public growerType: KnockoutObservable<GrowerType>;
    public products: KnockoutObservableArray<ProducedEnzymeModel>;
    public substrate: KnockoutObservable<number>;
    public biomassData: KnockoutObservableArray<any>;
    public substrateData: KnockoutObservableArray<any>;
    public productData: KnockoutObservableArray<any>;

    public temperatureText: KnockoutComputed<string>;
    public phText: KnockoutComputed<string>;
    public timerText: KnockoutComputed<string>;

    constructor() {

        this.fermentorTank = new FermentorTankModel();
        this.fermentorTank.location(LocationType.FERMENTOR);

        //TODO: implement field on organisms: microOrganism.hasBeenInHighConcentration.JavaNamingConventions().

        this.temperature = ko.observable(30.0);
        this.ph = ko.observable(7.0);
        this.timer = ko.observable(0); // Time in hours
        this.hourResolution = ko.observable(10); // This is used in the growth.
        this.growerType = ko.observable(GrowerType.FERMENTOR);
        this.products = ko.observableArray([]);

        this.substrate = ko.observable(19.0);

        this.biomassData = ko.observableArray([]);
        this.substrateData = ko.observableArray([]);
        this.productData = ko.observableArray([]);

        this.temperatureText = ko.computed(() => {
            return 'Temperatur: ' + this.temperature().toFixed(1) + ' °C';
        });

        this.phText = ko.computed(() => {
            return 'pH: ' + this.ph().toFixed(1);
        });

        this.timerText = ko.computed(() => {
            var hours = Math.floor(this.timer());
            var minutes = Math.round((this.timer() - hours) * 60);

            return 'Tid: ' + utils.formatter.leadingZeros(hours, 2) + ':' + utils.formatter.leadingZeros(minutes, 2);
        });

        this.initalizeData();
    }

    public initalizeData = () => {
        var biomassData =_.map(_.range(0, 250), (i) => {
            return utils.math.getBiomassFromConcentration(this.fermentorTank.getTotalConcentration());
        });

        var substrateData =_.map(_.range(0, 250), (i) => {
            return this.substrate();
        });

        var productData =_.map(_.range(0, 250), (i) => {
            return 0.0;
        });

        this.biomassData(biomassData);
        this.substrateData(substrateData);
        this.productData(productData);
    }

    public activate = () => {
        //TODO: config-file
    }

    public resetContents = () => {
        var dilutionFactor = this.fermentorTank.getTotalConcentration() / Math.pow(10,7);
        var clonedLiqs = this.fermentorTank.cloneLiquids();
        clonedLiqs = utils.biology.dilute(dilutionFactor, clonedLiqs);
        this.fermentorTank.clearContents();
        this.fermentorTank.addAll(clonedLiqs,true);

        this.products([]);

        this.substrate(19.0);

        this.initalizeData();
    }

    public storeGrowthStep = () => {
        // Biomass
        var biomassData = this.biomassData();
        var first = biomassData.shift();
        biomassData.push(utils.math.getBiomassFromConcentration(this.fermentorTank.getTotalConcentration()));
        this.biomassData(biomassData);

        // Substrate
        var substrateData = this.substrateData();
        first = substrateData.shift();
        substrateData.push(this.substrate());
        this.substrateData(substrateData);

        // Products //TODO:
        var productData = this.productData();
        var productConcentration = 0;
        _.each(this.products(), (producedEnzyme) => {
            productConcentration += producedEnzyme.amount;
        });
        first = productData.shift();
        productData.push(utils.math.getBiomassFromConcentration(productConcentration));
        this.productData(productData);
    }

    // Grows all containers one hour
    public growOneHour = () => {
        // For-løkke med mindre steps
        // Magic number, but it corresponds to the amount of sugar an organism consumes per unit of growth.
        var sugarConsumption = 1.87;
        var deltaTime = 1.0 / this.hourResolution();

        var concBefore = this.fermentorTank.getTotalConcentration();

        for(var i = 0; i < this.hourResolution(); i++) {
            this.fermentorTank.growContentsOnce(deltaTime, this.growerType(), this.ph(), this.temperature());

            _.each(this.fermentorTank.liquids(), (organism) => {
                if (!(organism.type() === LiquidType.MICROORGANISM))
                    return;


                // 1) find products and add to fermentor
                _.each(organism.producedEnzymes(), (producedEnzyme) => {

                    var match = _.find(this.products(), (product) => { return product.enzymeLiquidType === producedEnzyme.enzymeLiquidType });


                    if (!match) {
                        this.products.push(producedEnzyme);
                    } else { //if in fermentorProducts --> update concentration
                        match.amount += producedEnzyme.amount;
                    }
                });

                // 2) Set products to []
                organism.producedEnzymes([]);

            });
        }

        var concAfter = this.fermentorTank.getTotalConcentration();
        var biomassDiff = utils.math.getBiomassFromConcentration(concAfter - concBefore);
        this.substrate(this.substrate() - biomassDiff * sugarConsumption);

        this.timer(this.timer() + 1);

        this.storeGrowthStep();
    }

    public reset = () => {
        this.fermentorTank.clearContents();

        this.temperature(30.0);
        this.ph(7.0);
        this.timer(0);
        this.hourResolution(10);
        this.growerType(GrowerType.FERMENTOR);
        this.products([]);
        this.substrate(19.0);

        this.biomassData([]);
        this.substrateData([]);
        this.productData([]);
    }
}

export = Fermentor;
