define([
    'knockout',

    'controller/Base',

    'model/GameState'
], function (ko, BaseController, gameState) {

    var MouseController = BaseController.extend({

        gameState: gameState,

        constructor: function () {
            var self = this;

            self.handleDrop = function (event, $draggable) {
                var item = $draggable.data('content');

		        $draggable.off();
		        $draggable.chcDraggable('destroy');
                $draggable.remove();

		        gameState.addInventoryItem(item);
	        };

            self.handleVideoEnd = function (event) {
		        this.play();
	        };

	        self.handleDropOnMouse = function (event, $draggable) {
		        //Figure out what was droppen in mouse
		        var view = event.data,
			        id = $draggable.prop('id'),
			        mouse = Globals.lab.get('mouse');
		        switch(id) {
			    case 'water-bottle':
				    $draggable.removeClass('visible');
				    mouseDrinkingStart();
				    return;
		        }
		        if($draggable.hasClass('needle')) {
			        mouseNeedle($draggable.data('content'));
			        $draggable.remove();
			        return;
		        }
		        if($draggable.hasClass('scalpel')) {
			        if(mouse.attributes.alive === false) {
				        mouseScalpel();
				        $draggable.remove();
				        return;
			        }
			        else {
				        view.popupOKView.show('Kan ikke udføres', 'Musen skal være død.');
			        }

		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

            self.handleStartDrag = function (event) {
		        var $draggable = $(this),
			        id = $draggable.attr('id'),
			        $scene;
		        if(id === 'water-bottle') {
			        $scene = event.data.$el.find('.mouse-view');
			        $scene.addClass('no-bottle');
			        $draggable.addClass('visible');
		        }
	        };

	        self.handleDroppedOut = function (event) {
		        var $draggable = $(this),
			        id = $draggable.attr('id'),
			        mouse = Globals.lab.get('mouse'),
			        $scene, $deadMouse;
		        console.log('DROPPED OUT');
		        if(id === 'water-bottle') {
			        $scene = event.data.$el.find('.view');
			        $draggable.removeClass('visible');
			        $scene.removeClass('no-bottle');
		        }
		        if($draggable.hasClass('spleen') === true) {
			        console.log('Dropped out spleen');

		        }
	        };

	        self.handleSpawnDroppedOut = function (event) {
		        var mouse = Globals.lab.get('mouse');
		        mouse.attributes.spleen = true;
		        addDraggableSpleen();
	        };

	        /* !ANIMATION HANDLERS */
	        //TODO: Complete this one
	        self.stopAnimations = function () {
		        mouseRunStop();
	        };

	        self.mouseRunStart = function () {
		        var $video = $('#mouse-video-runfast');
		        var video = $video.get(0);
		        $video.removeClass('offscreen');
		        video.play();
		        mouseRunLoop();
	        };

	        self.mouseRunLoop = function () {
		        var $video = $('#mouse-video-runfast');
		        $video.on('ended', handleVideoEnd);
	        };

	        self.mouseRunStop = function () {
		        var $video = $('#mouse-video-runfast');
		        var video = $video.get(0);
		        video.pause();
		        video.currentTime = '0';
		        $video.off('ended', handleVideoEnd);
		        $video.addClass('offscreen');
	        };

	        self.mouseDrinkingStart = function () {
		        var $video = $('#mouse-video-drinkstart');
		        var video = $video.get(0);
		        var $loopVideo = $('#mouse-video-drinkloop');
		        var loopVideo = $loopVideo.get(0);

		        mouseRunStop();

		        $video.removeClass('offscreen');
		        video.play();
		        $video.one('ended', function() {
			        mouseDrinkingLoop();
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
			        mouseDrinkingStop();
			        mouseRunStart();
			        var $bottle = $('#water-bottle');
			        $bottle.addClass('visible');
			        $bottle.chcDraggable('returnToOriginalPosition', function() {
				        $bottle.removeClass('visible');
				        $('.mouse-view').removeClass('no-bottle');
				        $(document.body).trigger('task:INST_BOTTLE:ACTION_DRINK');
			        });
		        });
	        };

	        self.mouseDrinkingStop = function () {
		        var $video = $('#mouse-video-drinkloop');
		        $video.get(0).pause();
		        $video.off('ended', handleVideoEnd);
		        $video.addClass('offscreen');
	        };

	        self.mouseNeedle = function (content) {
		        var $video, video;
		        mouseRunStop();
		        if(content && content.hasOther('death')) {
			        $video = $('#mouse-video-injdie');
			        video = $video.get(0);
			        $video.removeClass('offscreen');
			        $video.one('ended', function(event) {
				        var mouse = Globals.lab.get('mouse');
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
				        mouseRunStart();
			        });
		        }

		        video.play();
	        };

	        self.mouseScalpel = function () {
		        var $video = $('#mouse-video-cut'),
			        video = $video.get(0);
		        $video.removeClass('offscreen');
		        $video.one('ended', function(event) {
			        var $mouseDroppable = $('#mouse'),
				        $deadMouse = $('#dead_mouse'),
				        mouse = Globals.lab.get('mouse');
			        video.pause();
			        video.currentTime = 0;
			        $video.addClass('offscreen');
			        mouse.attributes.cut = true;
			        addDraggableSpleen();
		        });
		        video.play();
	        };

	        self.addDraggableSpleen = function () {
		        var $mouseDroppable = $('#mouse'),
			        $deadMouse = $('#dead_mouse');
		        $deadMouse.removeClass('cut');
		        $deadMouse.addClass('cut-with-spleen');
		        $mouseDroppable.addClass('draggablespawner');
		        $mouseDroppable.chcDraggableSpawner({
			        styleClass: 'draggablespawn-popuplist',
			        additionalClasses: 'spleen',
			        spawnHTML: '<img src="img/icon_spleen.png" />',
			        content: new ContainerContent({
				        other: ['spleen']
			        })
		        });
		        $mouseDroppable.one('chcDraggableSpawned.chcEvent', function(event) {
			        var mouse = Globals.lab.get('mouse');
			        $deadMouse.removeClass('cut-with-spleen');
			        $deadMouse.addClass('cut');
			        $mouseDroppable.chcDraggableSpawner('destroy');
			        $mouseDroppable.removeClass('draggablespawner');
			        mouse.attributes.spleen = false;
		        });
	        };

	        /* GRAPH MANIPULATION */
	        self.getMouseData = function (mouseData) {
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
	        };
        }
    });

    return MouseController;
});
