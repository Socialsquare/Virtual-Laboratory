define([
    'knockout',
    'lodash',

    'controller/view/Base',
    'utils/utils',
    'utils/DataHelper',
    'service/Localization',

    'factory/Liquid',
    'model/Tube',
    'model/type/Liquid'


], function (ko, _, BaseViewController, utils, DataHelper, LocalizationService, LiquidFactory, TubeModel, LiquidType ) {

    var FermentorScreen = BaseViewController.extend({
        //TODO: make and use a microorganism attribute "hasBeenInHighConcentration". Only organisms that fulfill this will grow in the fermentor

        constructor: function () {
            var self = this;
            self.base('fermentorscreen');

            self.plotData = ko.observable({});
            self.graphTimer = ko.observable(null);
            self.turnedOn = ko.observable(false);
            //Used to determine whether the fermentor has run. If it has, and has contents, start/stop should ask whether one wants to reuse its contents
            self.activateButtonText = ko.computed(function(){
                return self.turnedOn() ? 'Stop' : 'Start'; //TODO: i18n
            });
            self.activateButtonColor = ko.computed(function(){
                return self.turnedOn() ? 'red-btn' : 'green-btn';
            });

            self.fermentor = self.gameState.fermentor;

            self.exportData = function () {
                var raw = self.plotData();
                var headers = ['time', 'biomass', 'substrate', 'product'];
                var parsed = _(raw.biomass)
                        .zip(raw.substrate, raw.product)
                        .map(function (row) {
                            return [row[0][0], row[0][1], row[1][1], row[2][1]];
                        })
                        .value();

                self.popupController.dataExport(DataHelper.toCSV(parsed, headers));
            };

            self.changeTemp = function(val) {
                self.fermentor.temperature(self.fermentor.temperature() + val);
            };

            self.changePh = function(val) {
                self.fermentor.ph(self.fermentor.ph() + val);
            };

            self.updatePlotData = function() {

                var biomassData = _.map(_.range(0, 250), function (i) {
                    return [i, self.fermentor.biomassData()[i]];
                });
                var substrateData = _.map(_.range(0, 250), function (i) {
                    return [i, self.fermentor.substrateData()[i]];
                });

                var productData = _.map(_.range(0, 250), function (i) {
                    return [i, self.fermentor.productData()[i]];
                });

                self.plotData({biomass: biomassData, substrate: substrateData, product: productData});
            };

            self.updatePlotData();

            self.activateFermentor = function () {
                // User starts the run
                 if (!self.turnedOn()) {
                     if (self.fermentor.fermentorTank.hasRun()) {
                         self.popupController.confirm('fermentor.restart.header', 'fermentor.restart.body').
                             then(function(){
                                 self.fermentor.resetContents();
                                 self.startFermentation();
                             });
                     }else {
                         self.startFermentation();
                     }

                 } else {
                 // User stops the run
                     self.popupController.notify('fermentor.stop.header', 'fermentor.stop.body');
                     self.endFermentation();
                     /*clearTimeout(self.graphTimer());
                     self.graphTimer(null);
                     self.turnedOn(false);*/
                 }
            };

            self.startFermentation = function() {
                var totalConc = self.fermentor.fermentorTank.getTotalConcentration();
                console.log('Started the fermentation with a totalConc of: ' + totalConc);
                console.log('logconc: ' + utils.math.getBaseLog(10,totalConc));

                self.popupController.notify('fermentor.start.header', 'fermentor.start.body');
                var graphTimer = setInterval(self.nextTimeStep, 100);
                self.graphTimer(graphTimer);
                self.turnedOn(true);
                self.fermentor.fermentorTank.hasRun(true);

                self.experimentController.triggerActivation(self.ActivationType.FERMENTOR, self.fermentor);
            };

            self.endFermentation = function() {
                clearTimeout(self.graphTimer());
                self.turnedOn(false);
                self.graphTimer(null);
                self.fermentor.timer(0);

                var options = [];


// Populate the list of possible products
                _.each(self.fermentor.products(), function(producedEnzyme) {
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
                    self.popupController.select('fermentor.chromatograph_select.header', 'fermentor.chromatograph_select.body', options)
                        .then(function (selectedObject) {
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
                                self.gameState.inventory.add(tube);
                            }

                        });
                }else {
                    self.popupController.message('fermentor.failed.header', 'fermentor.failed.body');
                }

            };

            self.nextTimeStep = function() {
                if(self.fermentor.timer() >= 60 || self.fermentor.substrate() <= 0) { //If reaches ran for 48 hours
                    self.endFermentation();
                    return;
                 }

                self.fermentor.growOneHour();

                self.updatePlotData();
            };

        }
    });

    return FermentorScreen;
});
