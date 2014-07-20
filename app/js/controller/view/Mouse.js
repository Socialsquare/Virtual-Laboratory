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
    'model/Bottle',
    'model/Juice',
    'model/Spleen',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function ($, ko, _, utils, DataHelper, DropOnMouseHelper, BaseViewController, VideoController, MouseModel, BottleModel, JuiceModel,
             SpleenModel, ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {

    var MouseController = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('mouse');

            self.videoController = new VideoController();

            self.mouse = self.gameState.mouse;
            self.mouseDrinking = ko.observable(false);

            // Begin: Notifications

            self.mouse().alive.subscribe(function(isAlive) {
                if (!isAlive && self.mouse().blodSukker() < self.mouse().minBlodSukker()) {
                    self.popupController.message('mouse.died_insulin.header', 'mouse.died_insulin.body');
                }
                // TODO: there are more ways to kill the poor mouse (well, at least one: The lethal injection)
            });

            self.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
            self.highBloodSugarWarningToggle = ko.observable(false);
            self.mouse().blodSukker.subscribe(function(blodSukker) {
                if (blodSukker < 2.5 && !self.lowBloodSugarWarningToggle()) {
                    self.lowBloodSugarWarningToggle(true);
                    self.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
                } else if (blodSukker > self.mouse().maxBlodSukker() * 0.8 && !self.highBloodSugarWarningToggle() &&
                    self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    self.highBloodSugarWarningToggle(true);
                    self.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');
                } else if (blodSukker >= self.mouse().maxBlodSukker()
                    && self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    self.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');
                }
            });

            // End: Notifications

            self.plotData = ko.observableArray([]);
            self.graphTimer = ko.observable(null);

            self.exportData =  function () {
                var data = DataHelper.toCSV(self.plotData(), ['time', 'bloodsugar']);
                self.popupController.dataExport(data);
            };

            var bottle = new BottleModel();
            bottle.add(new JuiceModel());
            self.bottle = bottle;

            self.plotData(_.map(_.range(0, 250), function (i) {
                return [i, self.mouse().bloodData()[i]];
            }));

            self.nextTimeStep = function() {
                self.mouse().nextBloodStep();

                self.plotData(_.map(_.range(0, 250), function (i) {
                    return [i, self.mouse().bloodData()[i]];
                }));
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

                var graphTimer = setInterval(self.nextTimeStep, 100);
                self.graphTimer(graphTimer);
            };

            self.exit = function () {
                self.videoController.stop();

                clearTimeout(self.graphTimer());
            };

            self.handleDropOnMouse = function(item) {
                return DropOnMouseHelper.handleDrop(self, item);
            };
        }

    });

    return MouseController;
});
