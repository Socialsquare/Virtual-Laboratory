define([
    'jquery',
    'knockout',
    'lodash',
    'utils/utils',
    'utils/DataHelper',
    'utils/mouse/DropOnMouseHelper',

    'controller/view/Base',
    'controller/Video',

    'model/Mouse',
    'model/Spleen',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem',

    'factory/Container',
    'factory/Liquid'

], function ($, ko, _, utils, DataHelper, DropOnMouseHelper,
             BaseViewController, VideoController, MouseModel,
             SpleenModel, ContainerType, LiquidType, MouseType,
             MouseBloodType, SpecialItemType, ContainerFactory,
             LiquidFactory) {

    var MouseController = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('mouse');

            self.videoController = new VideoController(true);

            self.mouse = self.gameState.mouse;
            self.mouseDrinking = ko.observable(false);

            // Begin: Notifications

            self.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
            self.highBloodSugarWarningToggle = ko.observable(false);
            self.diabetesDevelopedToggle = ko.observable(false);
            self.mouse().blodSukker.subscribe(function(blodSukker) {
                if (blodSukker < 1.5 && !self.lowBloodSugarWarningToggle()) {
                    self.lowBloodSugarWarningToggle(true);
                    self.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
                } else if (blodSukker > self.mouse().maxBlodSukker() * 0.8
                        && !self.highBloodSugarWarningToggle() && self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {

                    self.highBloodSugarWarningToggle(true);
                    self.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');

                } else if (blodSukker >= self.mouse().maxBlodSukker()
                        && !self.diabetesDevelopedToggle() && self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {

                    self.diabetesDevelopedToggle(true);
                    self.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');

                    self.mouse().mouseBloodType(MouseBloodType.DIABETIC);
                }
            });

            // End: Notifications

            self.plotData = ko.observableArray([]);
            self.graphTimer = ko.observable(null);

            self.exportData =  function () {
                var raw = self.plotData();
                var headers = ['time', 'bloodsugar', 'heart'];
                var parsed = _(raw.bloodData)
                    .zip(raw.heartRateData)
                    .map(function (row) {
                        return [row[0][0], row[0][1], row[1][1]];
                    })
                    .value();

                self.popupController.dataExport(DataHelper.toCSV(parsed, headers));
            };

            self.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

            //TODO: modify to object /w two fields
/*            self.plotData(_.map(_.range(0, 250), function (i) {
                return [i, self.mouse().bloodData()[i]];
            }));*/

            self.updatePlotData = function() {
                var bloodData = _.map(_.range(0, 250), function (i) {
                    return [i, self.mouse().bloodData()[i]];
                });

                var heartRateData = _.map(_.range(0,250), function(i) {

                    if (!self.mouse().alive())
                        return [i, 0];

                    var dataIndex = self.mouse().heartRateIndex + i;
                    dataIndex = dataIndex % self.mouse().heartRateData.length;

                    return [i, self.mouse().heartRateData[dataIndex]];
                });

                self.plotData({bloodData: bloodData, heartRateData: heartRateData});
            };

            self.updatePlotData();

            self.nextTimeStep = function() {
                self.mouse().nextBloodStep();
                self.mouse().nextHeartStep();

                if (self.mouse().hasLethalBloodSugar()) {
                    self.toggleSimulation(false);

                    self.videoController.play('fast-die-insulin', false).then(function () {
                        self.mouse().alive(false);
                        self.popupController.message('mouse.died_insulin.header', 'mouse.died_insulin.body');
                    });
                }

                self.updatePlotData();
            };

            self.injectionFromState = function () {
                if (self.mouse().alive()) {
                    switch (self.mouse().mouseType()) {
                    case MouseType.HEALTHY:
                        return self.videoController.play('fast-injection', false);

                    case MouseType.SMALLPOX:
                        return self.videoController.play('smallpox-injection', false);

                    case MouseType.GOUT:
                        return self.videoController.play('slow-injection-body-gout', false);
                    }
                }
            };

            self.runFromState = function () {
                if (self.mouse().alive()) {
                    switch (self.mouse().mouseType()) {
                    case MouseType.HEALTHY:
                        self.videoController.play('fast-loop', true);
                        break;

                    case MouseType.SMALLPOX:
                        self.videoController.play('smallpox-loop', true);
                        break;

                    case MouseType.GOUT:
                        self.videoController.play('slow-loop-gout', true);
                        break;

                    case MouseType.INSOMNIA:
                        self.videoController.play('slow-loop', true);
                        break;

                    case MouseType.PSORIASIS:
                        self.videoController.play('psoriasis-loop', true);
                        break;
                    default:
                        console.log('Mouse video error');
                        break;
                    }
                }
            };

            self.enter = function() {
                self.runFromState();

                self.toggleSimulation(true);
            };

            self.exit = function () {
                self.videoController.stop();
                self.toggleSimulation(false);
            };

            self.toggleSimulation = function (enabled) {
                if (enabled) {
                    self.graphTimer(setInterval(self.nextTimeStep, 100));
                } else {
                    clearTimeout(self.graphTimer());
                }
            };

            self.handleDropOnMouse = function(item) {
                return DropOnMouseHelper.handleDrop(self, item);
            };
        }

    });

    return MouseController;
});
