define([
    'jquery',
    'knockout',
    'lodash',
    'utils/utils',

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
], function ($, ko, _, utils, BaseViewController, VideoController, MouseModel, BottleModel, JuiceModel,
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
                if((! isAlive) && self.mouse().blodSukker() < self.mouse().minBlodSukker()) {
                    self.popupController.message('Musen er død', 'Du har dræbt musen ved at give den for meget insulin.');
                }
                // TODO: there are more ways to kill the poor mouse (well, at least one: The lethal injection)
            });

            self.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
            self.highBloodSugarWarningToggle = ko.observable(false);
            self.mouse().blodSukker.subscribe(function(blodSukker) {
                if(blodSukker < 2.5 && !self.lowBloodSugarWarningToggle()) {
                    self.lowBloodSugarWarningToggle(true);
                    self.popupController.message('Pas på', 'Du risikerer at dræbe musen ved at give den for meget insulin.');
                } else if(blodSukker > self.mouse().maxBlodSukker() * 0.8 && !self.highBloodSugarWarningToggle() &&
                    self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    self.highBloodSugarWarningToggle(true);
                    self.popupController.message('Pas på', 'Du risikerer at give musen sukkersyge ved at give den for meget juice.');
                } else if(blodSukker >= self.mouse().maxBlodSukker()
                    && self.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
                    self.popupController.message('Advarsel', 'Musen har nu udviklet sukkersyge.');
                }
            });

            // End: Notifications

            self.plotData = ko.observableArray([]);
            self.graphTimer = ko.observable(null);

            var bottle = new BottleModel();
            bottle.add(new JuiceModel());
            self.bottle = bottle;

            var plotData = _.map(_.range(0, 250), function (i) {
                return [i, self.mouse().bloodData()[i]];
            });
            self.plotData(plotData);

            // TODO: fix correct data

            self.nextPlotStep = function() {
                /*var graphTimer = window.setInterval(function () {*/
                self.mouse().nextBloodStep();

                var plotData = _.map(_.range(0, 250), function (i) {
                    return [i, self.mouse().bloodData()[i]];
                });
                self.plotData(plotData);

            };

            self.enter = function() {
                if (self.mouse().alive()) {
                    switch (self.mouse().mouseType()) {
                    case MouseType.HEALTHY:
                        self.videoController.play('run', true);
                        break;

                    case MouseType.SMALLPOX:
                        self.videoController.play('run-slow', true);
                        break;
                    }
                }

                var graphTimer = setInterval(self.nextPlotStep, 100);
                self.graphTimer(graphTimer);
            };

            self.exit = function () {
                self.videoController.stop();

                clearTimeout(self.graphTimer());
            };

            self.handleDropOnMouse = function(item) {

                switch(item.type()) {
                case ContainerType.BOTTLE:
                    if (!self.mouse().alive())
                        return false;

                    self.mouseDrinking(true);
                    self.videoController.play('drink-start', false)
                        .done(function () {
                            self.mouseDrinking(false);
                            self.videoController.play('run', true);
                        });
                    self.mouse().givJuice();
                    break;

                case SpecialItemType.SCALPEL:
                    if (self.mouse().alive()) {
                        self.popupController.message('mouse.cut_alive.header', 'mouse.cut_alive.body');
                        return false;
                    } else {
                        self.videoController.play('cut', false)
                            .done(function() {
                                self.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');
                                self.mouse().isCut(true);

                                var spleenContents = utils.klone(self.mouse().spleen.antibodiesFor());
                                var newSpleen = new SpleenModel();
                                newSpleen.antibodiesFor.pushAll(spleenContents());
                                self.gameState.inventory.add(newSpleen);
                            });


                    }
                    break;

                case ContainerType.SYRINGE:
                    if (!self.mouse().alive()) {
                        return false;
                    }
                    else if (item.contains(LiquidType.DEADLY)) {
                        self.videoController.play('injection-die', false)
                            .done(function () {
                                self.mouse().alive(false);
                                self.popupController.message('mouse.died.header', 'mouse.died.body');
                            });
                    }
                    else if (item.contains(LiquidType.INSULIN)) {
                        self.mouse().givInsulin();
                    }
                    else if (item.contains(LiquidType.ADJUVANS) &&
                             (item.contains(LiquidType.ANTIGEN_GOUT) || item.contains(LiquidType.ANTIGEN_SMALLPOX))) {

                        self.videoController.play(['injection-run', 'run'], true)
                            .done(function() {
                                if (item.contains(LiquidType.ANTIGEN_GOUT)) {
                                    self.mouse().vaccinate(LiquidType.ANTIGEN_GOUT);
                                    self.popupController.message('mouse.vaccinated_gout.header','mouse.vaccinated_gout.body');
                                }

                                if (item.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                                    self.mouse().vaccinate(LiquidType.ANTIGEN_SMALLPOX);
                                    self.popupController.message('mouse.vaccinated_smallpox.header','mouse.vaccinated_smallpox.body');
                                }
                            });
                    }
                    else if (item.contains(LiquidType.ANTIBODY_SMALLPOX) && self.mouse().mouseType() === MouseType.SMALLPOX) {
                        self.videoController.play(['injection-cure-smallpox', 'run'], true)
                            .done(function() {
                                self.mouse().cure(LiquidType.ANTIBODY_SMALLPOX);
                                self.popupController.message('mouse.cured_smallpox.header','mouse.cured_smallpox.body');
                            });
                    }
                    else if (item.contains(LiquidType.ANTIBODY_GOUT) && self.mouse().mouseType() === MouseType.GOUT) {
                        self.videoController.play(['injection-cure-gout', 'run'], true)
                            .done(function() {
                                self.mouse().cure(LiquidType.ANTIBODY_GOUT);
                                self.popupController.message('mouse.cured_gout.header','mouse.cured_gout.body');
                            });
                    }
                    else
                        self.videoController.play(['injection-run', 'run'], true);
                    break;
                }
            };


        }

    });

    return MouseController;
});
