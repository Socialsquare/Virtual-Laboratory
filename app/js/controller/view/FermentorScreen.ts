import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import utils = require('utils/utils');
import DataHelper = require('utils/DataHelper');
import gameState = require('model/GameState');
import LocalizationService = require('service/Localization');

import LiquidFactory = require('factory/Liquid');

import FermentorModel = require('model/Fermentor');
import TubeModel = require('model/Tube');

import LiquidType  = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');

class FermentorScreen extends BaseViewController {
    //TODO: make and use a microorganism attribute "hasBeenInHighConcentration". Only organisms that fulfill this will grow in the fermentor

    public fermentor: FermentorModel;

    public plotData: KnockoutObservable<any>;
    public graphTimer: KnockoutObservable<number>;
    public turnedOn: KnockoutObservable<boolean>;

    public activateButtonText: KnockoutComputed<string>;
    public activateButtonColor: KnockoutComputed<string>;

    constructor() {
        super('fermentorscreen');

        this.plotData = ko.observable({});
        this.graphTimer = ko.observable(null);
        this.turnedOn = ko.observable(false);

        //Used to determine whether the fermentor has run. If it has, and has contents, start/stop should ask whether one wants to reuse its contents
        this.activateButtonText = ko.pureComputed(() => {
            return this.turnedOn() ? 'Stop' : 'Start'; //TODO: i18n
        });

        this.activateButtonColor = ko.pureComputed(() => {
            return this.turnedOn() ? 'red-btn' : 'green-btn';
        });

        this.fermentor = gameState.fermentor;

        this.updatePlotData();

        ko.rebind(this);
    }

    activateFermentor() {
        // User starts the run
        if (!this.turnedOn()) {
            if (this.fermentor.fermentorTank.hasRun()) {
                this.popupController.confirm('fermentor.restart.header', 'fermentor.restart.body').
                    then(() => {
                        this.fermentor.resetContents();
                        this.startFermentation();
                    });
            } else {
                this.startFermentation();
            }

        } else {
            // User stops the run
            this.popupController.notify('fermentor.stop.header', 'fermentor.stop.body');
            this.endFermentation();
            /*clearTimeout(this.graphTimer());
              this.graphTimer(null);
              this.turnedOn(false);*/
        }
    }

    startFermentation() {
        this.popupController.notify('fermentor.start.header', 'fermentor.start.body');

        var graphTimer = setInterval(this.nextTimeStep, 100);

        this.graphTimer(graphTimer);
        this.turnedOn(true);
        this.fermentor.fermentorTank.hasRun(true);

        this.experimentController.triggerActivation(ActivationType.FERMENTOR_START, this.fermentor);
    }

    endFermentation() {
        clearTimeout(this.graphTimer());
        this.turnedOn(false);
        this.graphTimer(null);
        this.fermentor.timer(0);

        var options = [];

        // Populate the list of possible products
        _.each(this.fermentor.products(), (producedEnzyme) => {
            var enzymeBiomass = utils.math.getBiomassFromConcentration(producedEnzyme.amount);
            if (enzymeBiomass > 0.2){
                var enzymeLiquidType = producedEnzyme.enzymeLiquidType;

                switch (enzymeLiquidType) {
                case LiquidType.GFP:
                    return;
                case LiquidType.ANTIBODY_GOUT:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.antibody_gout'),
                                   value: enzymeLiquidType});
                    break;
                case LiquidType.ANTIBODY_SMALLPOX:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.antibody_smallpox'),
                                   value: enzymeLiquidType});
                    break;
                case LiquidType.LIPASE_ENZYME:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.lipase'),
                                   value: enzymeLiquidType});
                    break;
                case LiquidType.INSULIN:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.insulin'),
                                   value: enzymeLiquidType});
                    break;
                }
            }
        });


        if (options.length > 0) {
            this.popupController.select<LiquidType>('fermentor.chromatograph_select.header', 'fermentor.chromatograph_select.body', options)
                .then((selectedObject) => {
                    var selectedLiquidType = selectedObject.value;

                    var newLiquid = null;

                    switch (selectedLiquidType) {
                    case LiquidType.LIPASE_ENZYME:
                        newLiquid = LiquidFactory.lipase();
                        break;
                    case LiquidType.INSULIN:
                        newLiquid = LiquidFactory.insulin();
                        break;
                    case LiquidType.ANTIBODY_SMALLPOX:
                        newLiquid = LiquidFactory.antibodySmallpox();
                        break;
                    case LiquidType.ANTIBODY_GOUT:
                        newLiquid = LiquidFactory.antibodyGout();
                        break;
                    default:
                        break;
                    }

                    if (!!newLiquid) {
                        var tube = new TubeModel();
                        tube.add(newLiquid, true);
                        gameState.inventory.add(tube);
                    }

                });
        } else {
            this.popupController.message('fermentor.failed.header', 'fermentor.failed.body');
        }

    }

    nextTimeStep() {
        // If reaches ran for 48 hours
        if (this.fermentor.timer() >= 60 || this.fermentor.substrate() <= 0) {
            this.endFermentation();
            return;
        }

        this.fermentor.growOneHour();

        this.updatePlotData();
    }

    exportData() {
        var raw = this.plotData();
        var headers = ['time', 'biomass', 'substrate', 'product'];
        var parsed = _(<any[]>raw.biomass)
            .zip(raw.substrate, raw.product)
            .map((row) => {
                return [row[0][0], row[0][1], row[1][1], row[2][1]];
            })
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }

    changeTemp(val: number) {
        this.fermentor.temperature(this.fermentor.temperature() + val);
    }

    changePh(val: number) {
        this.fermentor.ph(this.fermentor.ph() + val);
    }

    updatePlotData() {

        var biomassData = _.map(_.range(0, 250), (i) => {
            return [i, this.fermentor.biomassData()[i]];
        });
        var substrateData = _.map(_.range(0, 250), (i) => {
            return [i, this.fermentor.substrateData()[i]];
        });

        var productData = _.map(_.range(0, 250), (i) => {
            return [i, this.fermentor.productData()[i]];
        });

        this.plotData({biomass: biomassData, substrate: substrateData, product: productData});
    }
}

export = FermentorScreen;
