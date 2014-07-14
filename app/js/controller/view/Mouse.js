define([
    'jquery',
    'knockout',
    'lodash',

    'controller/view/Base',
    'controller/Video',

    'model/Mouse',
    'model/Bottle',
    'model/Juice',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function ($, ko, _, BaseViewController, VideoController, MouseModel, BottleModel, JuiceModel, ContainerType, LiquidType, MouseBloodType, SpecialItemType) {

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
                if (self.mouse().alive())
                    self.videoController.play('run', true);

                var graphTimer = setInterval(self.nextPlotStep, 100);
                self.graphTimer(graphTimer);
            };

            self.exit = function () {
                self.videoController.stop();

                clearTimeout(self.graphTimer());
                /*window.clearInterval(self.graphTimer());*/
                /*self.graphTimer*/
            };

            self.handleDropOnMouse = function (item) {

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
                    break;

                case SpecialItemType.SCALPEL:
                    if (self.gameState.mouse().alive()) {
                        self.popupController.message('Nej', 'Musen skal være død.');
                        return false;
                    } else {
                        self.videoController.play('cut', false);
                    }
                    break;

                case ContainerType.SYRINGE:
                    if (item.contains(LiquidType.DEADLY)) {
                        self.videoController.play('injection-die', false)
                            .done(function () {
                                self.mouse().alive(false);
                                self.popupController.message('Satans', 'Musen døde');
                            });
                    }
                    else
                        self.videoController.play(['injection-run', 'run'], true);
                    break;
                }
            };

            /* GRAPH MANIPULATION */
            /*self.getMouseData = function (mouseData) {
                if(mouseData.length > 0) {
                    mouseData = mouseData.slice(1);
                }

                while(mouseData.length < 250) {
                    var prev = mouseData.length > 0 ? mouseData[mouseData.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if (y < 0) {
                        y = 0;
                    }
                    else if (y > 100) {
                        y = 100;
                    }
                    mouseData.push(y);
                }

                return mouseData;
            };

            self.getPlotData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    res.push([i, data[i]]);
                }
                return res;
            };*/
        }

        /*getMouseData: function (mouseData) {
            if(mouseData.length > 0) {
                mouseData = mouseData.slice(1);
            }

            while(mouseData.length < 250) {
                var prev = mouseData.length > 0 ? mouseData[mouseData.length - 1] : 50;
                var y = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                }
                else if (y > 100) {
                    y = 100;
                }
                mouseData.push(y);
            }

            return mouseData;
        },*/
    });

    return MouseController;
});
