define([
    'jquery',
    'knockout',
    'lodash',
    'controller/view/Base',
    'model/Mouse',
    'model/Bottle',
    'model/Juice',
    'model/type/Container',
    'model/type/MouseBlood'
], function ($, ko, _, BaseViewController, MouseModel, BottleModel, JuiceModel, ContainerType, MouseBloodType) {

    var MouseController = BaseViewController.extend({

        activeVideo: ko.observable('runfast'),

        constructor: function () {
            var self = this;
            self.base('mouse');

            self.mouse = new MouseModel(MouseBloodType.DIABETIC);

            // Begin: Notifications

            self.mouse.alive.subscribe(function(isAlive) {
                if((! isAlive) && self.mouse.blodSukker() < self.mouse.minBlodSukker()) {
                    self.popupController.message('Musen er død', 'Du har dræbt musen ved at give den for meget insulin.');
                }
                // TODO: there are more ways to kill the poor mouse (well, at least one: The lethal injection)
            });

            self.lowBloodSugarWarningToggle = ko.observable(false); // Such name. Wow.
            self.highBloodSugarWarningToggle = ko.observable(false);
            self.mouse.blodSukker.subscribe(function(blodSukker) {
                if(blodSukker < 2.5 && !self.lowBloodSugarWarningToggle()) {
                    self.lowBloodSugarWarningToggle(true);
                    self.popupController.message('Pas på', 'Du risikerer at dræbe musen ved at give den for meget insulin.');
                } else if(blodSukker > self.mouse.maxBlodSukker() * 0.8 && !self.highBloodSugarWarningToggle() &&
                    self.mouse.mouseBloodType() === MouseBloodType.NORMAL) {
                    self.highBloodSugarWarningToggle(true);
                    self.popupController.message('Pas på', 'Du risikerer at give musen sukkersyge ved at give den for meget juice.');
                } else if(blodSukker >= self.mouse.maxBlodSukker()
                    && self.mouse.mouseBloodType() === MouseBloodType.NORMAL) {
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
                return [i, self.mouse.bloodData()[i]];
            });
            self.plotData(plotData);

            // TODO: fix correct data

            self.nextPlotStep = function() {
                /*var graphTimer = window.setInterval(function () {*/
                self.mouse.nextBloodStep();

                var plotData = _.map(_.range(0, 250), function (i) {
                    return [i, self.mouse.bloodData()[i]];
                });
                self.plotData(plotData);

            };

            self.enter = function() {
                var graphTimer = setInterval(self.nextPlotStep, 100);
                self.graphTimer(graphTimer);
            };

            self.exit = function () {
                clearTimeout(self.graphTimer());
                /*window.clearInterval(self.graphTimer());*/
                /*self.graphTimer*/
            };

            self.handleVideoEnd = function (event) {
                this.play();
            };

            self.handleDropOnMouse = function (item) {

                switch(item.type()) {
                case ContainerType.BOTTLE:
                    console.log('TODO: bottle on mouse');
                    break;

                // case SpecialType.SCALPEL:
                // case SpecialType.SPLEEN:
                // case SpecialType.NEEDLE:
                //     break;
                }
            };

            /* !ANIMATION HANDLERS */
            //TODO: Complete this one
            self.stopAnimations = function () {
                self.mouseRunStop();
            };

            self.mouseRunStart = function () {
                var $video = $('#mouse-video-runfast');
                var video = $video.get(0);
                $video.removeClass('offscreen');
                video.play();
                self.mouseRunLoop();
            };

            self.mouseRunLoop = function () {
                var $video = $('#mouse-video-runfast');
                $video.on('ended', self.handleVideoEnd);
            };

            self.mouseRunStop = function () {
                var $video = $('#mouse-video-runfast');
                var video = $video.get(0);
                video.pause();
                video.currentTime = '0';
                $video.off('ended', self.handleVideoEnd);
                $video.addClass('offscreen');
            };

            self.mouseDrinkingStart = function () {
                var $video = $('#mouse-video-drinkstart');
                var video = $video.get(0);
                var $loopVideo = $('#mouse-video-drinkloop');
                var loopVideo = $loopVideo.get(0);

                self.mouseRunStop();

                $video.removeClass('offscreen');
                video.play();
                $video.one('ended', function() {
                    self.mouseDrinkingLoop();
                });
            };

            self.mouseDrinkingLoop = function () {
                var $video = $('#mouse-video-drinkloop');
                var video = $video.get(0);
                var $startVideo = $('#mouse-video-drinkstart');
                var startVideo = $startVideo.get(0);
                $startVideo.addClass('offscreen');
                $video.removeClass('offscreen');
                video.play();
                startVideo.pause();
                $video.on('ended', function() {
                    self.mouseDrinkingStop();
                    self.mouseRunStart();
                    var $bottle = $('#water-bottle');
                    $bottle.addClass('visible');
                    $bottle.chcDraggable('returnToOriginalPosition', function() {
                        $bottle.removeClass('visible');
                        self.isDragginWaterBottle(false);
                        $('.mouse-view').removeClass('no-bottle');
                        $(document.body).trigger('task:INST_BOTTLE:ACTION_DRINK');
                    });
                });
            };

            self.mouseDrinkingStop = function () {
                var $video = $('#mouse-video-drinkloop');
                $video.get(0).pause();
                $video.off('ended', self.handleVideoEnd);
                $video.addClass('offscreen');
            };

            self.mouseNeedle = function (content) {
                var $video, video;
                self.mouseRunStop();
                if(content && content.hasOther('death')) {
                    $video = $('#mouse-video-injdie');
                    video = $video.get(0);
                    $video.removeClass('offscreen');
                    $video.one('ended', function(event) {
                        var mouse = gameState.mouse();
                        mouse.attributes.alive = false;
                        video.pause();
                        video.currentTime = 0;
                        $video.addClass('offscreen');
                        $('#dead_mouse').removeClass('hidden');
                    });
                }
                else {
                    $video = $('#mouse-video-inj');
                    video = $video.get(0);
                    $video.removeClass('offscreen');
                    $video.one('ended', function(event) {
                        video.pause();
                        video.currentTime = 0;
                        $video.addClass('offscreen');
                        self.mouseRunStart();
                    });
                }

                video.play();
            };

            // self.mouseScalpel = function () {
            //   var $video = $('#mouse-video-cut'),
            //     video = $video.get(0);
            //   $video.removeClass('offscreen');
            //   $video.one('ended', function(event) {
            //     var $mouseDroppable = $('#mouse'),
            //       $deadMouse = $('#dead_mouse'),
            //       mouse = gameState.mouse();
            //     video.pause();
            //     video.currentTime = 0;
            //     $video.addClass('offscreen');
            //     mouse.attributes.cut = true;
            //     self.addDraggableSpleen();
            //   });
            //   video.play();
            // };

            // self.addDraggableSpleen = function () {
            //   var $mouseDroppable = $('#mouse'),
            //     $deadMouse = $('#dead_mouse');
            //   $deadMouse.removeClass('cut');
            //   $deadMouse.addClass('cut-with-spleen');
            //   $mouseDroppable.addClass('draggablespawner');
            //   $mouseDroppable.chcDraggableSpawner({
            //     styleClass: 'draggablespawn-popuplist',
            //     additionalClasses: 'spleen',
            //     spawnHTML: '<img src="img/icon_spleen.png" />',
            //     content: new ContainerContent({
            //       other: ['spleen']
            //     })
            //   });
            //   $mouseDroppable.one('chcDraggableSpawned.chcEvent', function(event) {
            //     var mouse = gameState.mouse();
            //     $deadMouse.removeClass('cut-with-spleen');
            //     $deadMouse.addClass('cut');
            //     $mouseDroppable.chcDraggableSpawner('destroy');
            //     $mouseDroppable.removeClass('draggablespawner');
            //     mouse.attributes.spleen = false;
            //   });
            // };

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
