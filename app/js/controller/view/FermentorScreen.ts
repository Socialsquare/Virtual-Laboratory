import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import utils = require('utils/utils');
import DataHelper = require('utils/DataHelper');

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

    public turnedOn: KnockoutComputed<boolean>;
    public activateButtonText: KnockoutComputed<string>;
    public activateButtonColor: KnockoutComputed<string>;

    constructor() {
        super('fermentorscreen');

        this.plotData = ko.observable({});
        this.graphTimer = ko.observable(null);
        this.turnedOn = ko.observable(false);

        //Used to determine whether the fermentor has run. If it has, and has contents, start/stop should ask whether one wants to reuse its contents
        this.activateButtonText = ko.computed(() => {
            return this.turnedOn() ? 'Stop' : 'Start'; //TODO: i18n
        });

        this.activateButtonColor = ko.computed(() => {
            return this.turnedOn() ? 'red-btn' : 'green-btn';
        });

        this.fermentor = this.gameState.fermentor;

        this.updatePlotData();
    }

    public activateFermentor = () => {
        // User starts the run
        if (!this.turnedOn()) {
            if (this.fermentor.fermentorTank.hasRun()) {
                this.popupController.confirm('fermentor.restart.header', 'fermentor.restart.body').
                    then(() => {
                        this.fermentor.resetContents();
                        this.startFermentation();
                    });
            }else {
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

    public startFermentation = () => {
        var totalConc = this.fermentor.fermentorTank.getTotalConcentration();
        console.log('Started the fermentation with a totalConc of: ' + totalConc);
        console.log('logconc: ' + utils.math.getBaseLog(10,totalConc));

        this.popupController.notify('fermentor.start.header', 'fermentor.start.body');
        var graphTimer = setInterval(this.nextTimeStep, 100);
        this.graphTimer(graphTimer);
        this.turnedOn(true);
        this.fermentor.fermentorTank.hasRun(true);

        this.experimentController.triggerActivation(ActivationType.FERMENTOR, this.fermentor);
    }

    public endFermentation = () => {
        clearTimeout(this.graphTimer());
        this.turnedOn(false);
        this.graphTimer(null);
        this.fermentor.timer(0);

        var options = [];


        // Populate the list of possible products
        _.each(this.fermentor.products(), (producedEnzyme) => {
            if(utils.math.getBiomassFromConcentration(producedEnzyme.amount) > 0.2){
                var enzymeLiquidType = producedEnzyme.enzymeLiquidType;

                switch (enzymeLiquidType) {
                case LiquidType.GFP:
                    return;
                case LiquidType.ANTIBODY_GOUT:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.antibody_gout'),
                                   liquidType: enzymeLiquidType});
                    break;
                case LiquidType.ANTIBODY_SMALLPOX:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.antibody_smallpox'),
                                   liquidType: enzymeLiquidType});
                    break;
                case LiquidType.LIPASE_ENZYME:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.lipase'),
                                   liquidType: enzymeLiquidType});
                    break;
                case LiquidType.INSULIN:
                    options.push({ key: LocalizationService.text('fermentor.chromatograph_product.insulin'),
                                   liquidType: enzymeLiquidType});
                    break;
                }
            }
        });


        if (options.length > 0) {
            this.popupController.select('fermentor.chromatograph_select.header', 'fermentor.chromatograph_select.body', options)
                .then((selectedObject) => {
                    var selectedLiquidType = selectedObject.liquidType;

                    console.log('Test #1: '+ selectedLiquidType);

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
                        this.gameState.inventory.add(tube);
                    }

                });
        }else {
            this.popupController.message('fermentor.failed.header', 'fermentor.failed.body');
        }

    }

    public nextTimeStep = () => {
        if(this.fermentor.timer() >= 60 || this.fermentor.substrate() <= 0) { //If reaches ran for 48 hours
            this.endFermentation();
            return;
        }

        this.fermentor.growOneHour();

        this.updatePlotData();
    }

    public exportData = () => {
        var raw = this.plotData();
        var headers = ['time', 'biomass', 'substrate', 'product'];
        var parsed = _(raw.biomass)
            .zip(raw.substrate, raw.product)
            .map((row) => {
                return [row[0][0], row[0][1], row[1][1], row[2][1]];
            })
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }

    public changeTemp = (val) => {
        this.fermentor.temperature(this.fermentor.temperature() + val);
    }

    public changePh = (val) => {
        this.fermentor.ph(this.fermentor.ph() + val);
    }

    public updatePlotData = () => {

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
