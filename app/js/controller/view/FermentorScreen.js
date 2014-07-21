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
                self.popupController.notify('fermentor.start.header', 'fermentor.start.body');

                // User starts the run
                 if (!self.turnedOn()) {
                     var graphTimer = setInterval(self.nextTimeStep, 100);
                     self.graphTimer(graphTimer);
                     self.turnedOn(true);

                     self.experimentController.triggerActivation(self.ActivationType.FERMENTOR);
                 } else {
                 // User stops the run
                     clearTimeout(self.graphTimer());
                     self.graphTimer(null);
                     self.turnedOn(false);
                 }
            };


            self.endFermentation = function() {
                // TODO: reset fermentor (fermentor products, substrate, contents (make a copy of original?)??)
                clearTimeout(self.graphTimer());
                self.turnedOn(false);
                self.graphTimer(null);
                self.fermentor.timer(0);

                var options = [];


// Populate the list of possible products
                _.each(self.fermentor.products(), function(producedEnzyme) {
                    if(utils.math.getBiomassFromConcentration(producedEnzyme.amount) > 0.2){
                        var enzymeLiquidType = producedEnzyme.enzymeLiquidType;

//TODO: i18n localization
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
