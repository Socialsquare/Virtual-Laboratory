define([
    'jquery',
    'knockout',
    'lodash',
    'controller/view/Base',
    'model/Bottle',
    'model/Juice',
    'model/type/Container'
], function ($, ko, _, BaseViewController, BottleModel, JuiceModel, ContainerType) {

    var MouseController = BaseViewController.extend({

        activeVideo: ko.observable('runfast'),

        mouseData: ko.observableArray([]),
        plotData: ko.observableArray([]),

        graphTimer: null,

        constructor: function () {
            var self = this;
            self.base('mouse');


            var bottle = new BottleModel();
            bottle.add(new JuiceModel());
            self.bottle = bottle;
            // Initializing the mouseData

// TODO: Patrick testing. One array for data, then zipping it with the indices
            var mouseData = _.map(_.range(0, 250), function (i) {
                return Math.random() * 100;
            });
            self.mouseData(mouseData);

            var plotData = _.map(_.range(0, 250), function (i) {
                return [i, self.mouseData()[i]];
            });
            self.plotData(plotData);

            // TODO: fix correct data
            // dummy mouse data
            self.graphTimer = window.setInterval(function () {
                var mouseData = self.mouseData();
                var first = mouseData.shift();
                mouseData.push(first);
                self.mouseData(mouseData);

                var plotData = _.map(_.range(0, 250), function (i) {
                    return [i, self.mouseData()[i]];
                });
                self.plotData(plotData);

            }, 30);

            self.exit = function () {
                window.clearInterval(self.graphTimer);
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
