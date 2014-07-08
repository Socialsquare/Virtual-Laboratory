define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState'
], function (ko, $, BaseViewController, Notifier, gameState) {

    var Worktable1 = BaseViewController.extend({

        gameState: gameState,
        worktable1: gameState.worktable1,

        constructor: function () {
            var self = this;
            self.base('worktable1');

	        self.renderTable = function () {
		        var worktable1 = gameState.worktable1,
			        $table = $('#worktable1-table'),
			        i, emptyOrFull, $petridish;
		        for(i = 0; i < worktable1.tableItems.length; i++) {
			        emptyOrFull = 'empty';
			        if(worktable1.tableItems[i] !== null) {
				        if(worktable1.tableItems[i].hasContent()) {
					        emptyOrFull = 'full';
				        }
				        $petridish = $('<div class="petridish draggable droppable" data-table-position="' + i + '"><img src="img/petri_' + emptyOrFull + '.png" /></div>');
				        $table.append($petridish);

				        $petridish.css({
					        'position': 'absolute',
					        'top': 0,
					        'left': (i * $petridish.find('img').width() + 50) + 'px',
					        'z-index': 10
				        });
			        }
		        }
	        };

	        self.renderHeater = function () {
		        var worktable1 = gameState.worktable1,
			        i;

		        for(i = 0; i < worktable1.attributes.heater.content.length; i++) {
			        if(worktable1.attributes.heater.content[i] !== null) {
				        $('#worktable1-heater-testtubeholder ul li:nth-child(' + (i + 1) + ')').html('<div class="draggable testtube"><img src="img/work1-heater_' + (i + 1) + '.png" alt="Heater tube" /></div>');
			        }
		        }
	        };

	        /* !EVENT HANDLERS */

	        self.handleDrop = function (event, $draggable) {
		        event.stopPropagation();
		        event.preventDefault();
		        var $droppable = $(this);

		        switch($droppable.attr('id')) {
			    case 'worktable1-table':
				    handleDropOnTable(event.data, $droppable, $draggable);
				    return;
			    case 'worktable1-electroporator':
				    handleDropOnElectroporator(event.data, $droppable, $draggable);
				    return;
		        }
		        if($droppable.hasClass('testtubeholder-slot')) {
			        self.handleDropOnTestTubeHolder(event.data, $droppable, $draggable);
		        }
		        if($droppable.hasClass('petridish')) {
			        handleDropOnPetridish(event.data, $droppable, $draggable);
		        }
		        if($droppable.hasClass('heater-slot')) {
			        handleDropOnHeater(event.data, $droppable, $draggable);
		        }
	        };

	        self.handleDropOnTable = function (view, $table, $draggable) {
		        var worktable1 = gameState.worktable1,
			        content;

		        if(!worktable1.bunsenBurner()) {
			        Notifier.pop('Kan ikke udføres', 'Bunsenbrænderen skal være tændt før du kan arbejde med bordet.');
			        $draggable.chcDraggable('returnToOriginalPosition');
			        return;
		        }

		        if($draggable.hasClass('petridish')) {
			        var position = worktable1.addPetridish($draggable.data('content'));
			        if(position >= 0) {
				        $draggable.removeAttr('style');
				        $draggable.removeClass('draggablespawn draggablespawn-popuplist');
				        $draggable.off();
				        $draggable.chcDraggable('destroy');

				        $draggable.chcDraggable();
				        if(worktable1.isPetridishEmpty(position)) {
					        $draggable.html('<img src="img/petri_empty.png" />');
				        }
				        else {
					        $draggable.html('<img src="img/petri_full.png" />');
				        }
				        $draggable.data('tablePosition', position);
				        $draggable.addClass('droppable');
				        $draggable.chcDroppable();
				        $table.append($draggable);
				        setTimeout(function() {
					        $draggable.css({
						        'position': 'absolute',
						        'top': 0,
						        'left': (position * $draggable.find('img').width() + 50) + 'px',
						        'z-index': 10
					        });
				        }, 1);
				        return;
			        }
		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

	        self.handleDropOnTestTubeHolder = function (view, $testTubeHolderSlot, $draggable) {
		        var position = $testTubeHolderSlot.index();
                var item = gameState.draggingItem();

		        if(!self.worktable1.bunsenBurner()) {
			        Notifier.pop('Kan ikke udføres', 'Bunsenbrænderen skal være tændt før du kan arbejde med reagensglas.');
			        $draggable.chcDraggable('returnToOriginalPosition');
			        return;
		        }

		        if(item.type() === 'testtube') {
			        if(self.worktable1.tubeRack.add(item, position)) {
                        gameState.inventory.remove(item);

                        $draggable.remove();
				        return;
			        }
		        }

		        if($draggable.hasClass('dna')) {
			        if(!worktable1.isTestTubeSlotEmpty(position)) {
				        worktable1.fillTube(position, new ContainerContent({genes: [$draggable.data('DNA')]}));
				        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				        $draggable.remove();
				        return;
			        }
		        }

		        if($draggable.hasClass('yeastcells')) {
			        if(!worktable1.isTestTubeSlotEmpty(position)) {
				        content = $draggable.data('content');
				        if(worktable1.hasTubePlaceFor(position, content)) {
					        worktable1.fillTube(position, content);
					        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
					        $draggable.remove();
					        return;
				        }
				        else {
					        view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i reagensglasset.');
				        }
			        }
		        }

		        if($draggable.hasClass('antibiotic')) {
			        if(!worktable1.isTestTubeSlotEmpty(position)) {
				        content = $draggable.data('content');
				        worktable1.fillTube(position, content);
				        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				        $draggable.remove();
				        return;
			        }
		        }

		        if($draggable.hasClass('pipette')) {
			        if(!worktable1.isTestTubeSlotEmpty(position) && lab.hasPipetteTip()) {
				        if(lab.isPipetteFull()) {
					        if(worktable1.hasTubePlaceFor(position, lab.get('pipette').content)) {
						        content = lab.emptyPipette('tube');
						        if(!content.isEmpty()) {
							        worktable1.fillTube(position, content);
							        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
						        }
					        }
					        else {
						        view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i reagensglasset');
					        }
				        }
				        else {
					        if(!worktable1.isTubeEmpty(position)) {
						        lab.fillPipette(worktable1.getTube(position).getContent());
						        worktable1.emptyTube(position);
						        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_empty.png" alt="Test tube" />');
					        }
				        }
			        }
		        }

		        if($draggable.hasClass('needle')) {
			        if(!worktable1.isTestTubeSlotEmpty(position)) {
				        $draggable.data('content', worktable1.getTube(position).getContent());

				        console.log('Added content to needle');
				        console.log($draggable.data('content'));
				        worktable1.emptyTube(position);
				        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_empty.png" alt="Test tube" />');
			        }
		        }

		        if($draggable.hasClass('death')) {
			        if(!worktable1.isTestTubeSlotEmpty(position)) {
				        worktable1.fillTube(position, $draggable.data('content'));
				        $('#worktable1-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				        $draggable.remove();
				        return;
			        }
		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

	        self.handleDropOnPetridish = function (view, $petridish, $draggable) {
		        var lab = Globals.lab,
			        worktable1 = lab.get('worktable1'),
			        position = $petridish.data('tablePosition'),
			        content;

		        if($draggable.hasClass('pipette') && lab.hasPipetteTip()) {
			        if(lab.isPipetteFull()) {
				        if(worktable1.hasPetridishPlaceFor(position, lab.get('pipette').content)) {
					        content = lab.emptyPipette('petridish');
					        if(!content.isEmpty()) {
						        worktable1.fillPetridish(position, content);
						        $petridish.html('<img src="img/petri_full.png" />');
					        }
				        }
				        else {
					        view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i petriskålen.');
				        }
			        }
			        else {
				        if(!worktable1.isPetridishEmpty(position)) {
					        lab.fillPipette(worktable1.getTableItem(position).getContent());
					        worktable1.emptyPetridish(position);
					        $petridish.html('<img src="img/petri_empty.png" />');
				        }
			        }
		        }

		        if($draggable.hasClass('dna')) {
			        worktable1.fillPetridish(position, new ContainerContent({genes: [$draggable.data('DNA')]}));
			        $petridish.html('<img src="img/petri_full.png" />');
			        $draggable.remove();
			        return;
		        }

		        if($draggable.hasClass('yeastcells')) {
			        content = $draggable.data('content');
			        if(worktable1.hasPetridishPlaceFor(position, content)) {
				        worktable1.fillPetridish(position, content);
				        $petridish.html('<img src="img/petri_full.png" />');
				        $draggable.remove();
				        return;
			        }
			        else {
				        view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i petriskålen.');
			        }
		        }

		        if($draggable.hasClass('antibiotic')) {
			        content = $draggable.data('content');
			        worktable1.fillPetridish(position, content);
			        $petridish.html('<img src="img/petri_full.png" />');
			        $draggable.remove();
			        return;
		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

	        self.handleDropOnElectroporator = function (view, $electroporator, $draggable) {
		        var lab = Globals.lab,
			        worktable1 = lab.get('worktable1'),
			        electroporator = worktable1.attributes.electroporator;
		        if($draggable.hasClass('pipette') && lab.hasPipetteTip()) {
			        if(lab.isPipetteFull()) {
				        if(worktable1.hasElectroporatorPlaceFor(lab.get('pipette').content)) {
					        worktable1.fillElectroporator(lab.emptyPipette('electroporator'));
				        }
			        }
			        else {
				        if(!worktable1.isElectroporatorEmpty()) {
					        lab.fillPipette(worktable1.getElectroporatorContent());
					        worktable1.emptyElectroporator();
				        }
			        }
		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

	        self.handleDropOnHeater = function (view, $heaterSlot, $draggable) {
		        var worktable1 = gameState.worktable1,
			        position, content;
		        position = $heaterSlot.index();
		        if($draggable.hasClass('testtube')) {
			        content = $draggable.data('content');
			        if(worktable1.addHeaterTubeAtPos(content, position) === true) {
				        $draggable.removeAttr('style');
				        $draggable.removeClass('draggablespawn draggablespawn-popuplist');
				        $draggable.off();
				        $draggable.chcDraggable('destroy');
				        $draggable.chcDraggable();
				        $draggable.html('<img src="img/work1-heater_' + (position + 1) + '.png" alt="Heater tube" />');
				        $heaterSlot.append($draggable);
				        return;
			        }
		        }

		        $draggable.chcDraggable('returnToOriginalPosition');
	        };

	        self.handleStartDrag = function (event) {
		        var $draggable = $(this),
			        worktable1 = gameState.worktable1,
			        position;

		        $draggable.chcDroppable('destroy');
		        $draggable.removeClass('droppable');
		        $draggable.data('parent', $draggable.parent());

		        if($draggable.hasClass('petridish')) {
			        position = $draggable.data('tablePosition');
			        $draggable.html('<img src="img/icon_cup_petri.png" />');
			        $draggable.data('content', worktable1.getTableItem(position));
			        worktable1.removeTableItem(position);
		        }

		        if($draggable.hasClass('testtube')) {
			        position = $draggable.parent().index();
			        $draggable.data('tubeholderPosition', position);
			        if($draggable.parent().hasClass('heater-slot')) {
				        $draggable.data('content', worktable1.getHeaterTube(position));
				        worktable1.removeHeaterTubeAtPos(position);
			        }
			        else {
				        $draggable.data('content', worktable1.getTube(position));
				        worktable1.removeTestTubeAtPos(position);
			        }

			        $draggable.html('<img src="img/icon_cup_tube.png" />');
		        }
	        };

	        self.handleDroppedOut = function (event) {
		        var $draggable = $(this),
			        worktable1 = gameState.worktable1,
			        emptyOrFull = 'empty',
			        position;

		        if($draggable.hasClass('petridish')) {
			        position = worktable1.addPetridish($draggable.data('content'));
			        if(worktable1.attributes.tableItems[position].hasContent()) {
				        emptyOrFull = 'full';
			        }
			        $draggable.html('<img src="img/petri_' + emptyOrFull + '.png" />');
			        $draggable.data('tablePosition', position);
			        $draggable.addClass('droppable');
			        $draggable.chcDroppable();
			        $draggable.data('parent').append($draggable);
			        setTimeout(function() {
				        $draggable.css({
					        'position': 'absolute',
					        'top': 0,
					        'left': (position * $draggable.find('img').width() + 50) + 'px',
					        'z-index': 10
				        });
			        }, 1);
		        }

		        if($draggable.hasClass('testtube') && $draggable.data('parent').hasClass('testtubeholder-slot')) {
			        position = $draggable.data('tubeholderPosition');
			        worktable1.addTestTubeAtPos($draggable.data('content'), position);
			        if(worktable1.attributes.testTubes[position].hasContent()) {
				        emptyOrFull = 'full';
			        }
			        $draggable.html('<img src="img/worktable1_testtube_' + (position + 1) + '_' + emptyOrFull + '.png" alt="Test tube" />');
		        }

		        if($draggable.hasClass('testtube') && $draggable.data('parent').hasClass('heater-slot')) {
			        position = $draggable.data('tubeholderPosition');
			        worktable1.addTestTubeAtPos($draggable.data('content'), position);
			        $draggable.html('<img src="img/work1-heater_' + (position + 1) + '.png" alt="Heater tube" />');
		        }
	        };

	        self.activateElectroporator = function (event) {
		        var $this = $(this),
			        view = event.data,
			        worktable1 = gameState.worktable1,
			        playVideos;

		        playVideos = function(currentVideo, lastVideo, message) {
			        var $video, video;
			        if(currentVideo > lastVideo) {
				        if(message.length > 0) {
					        view.popupOKView.show('Kan ikke udføres', message);
				        }
				        $('.video-container', view.$el).removeClass('playing');
				        return;
			        }
			        $video = $(view.electroporatorVideos[currentVideo], view.$el);
			        video = $video.get(0);
			        $video.removeClass('offscreen');
			        video.play();
			        $video.one('ended', function() {
				        video.pause();
				        video.currentTime = '0';
				        $video.addClass('offscreen');
				        playVideos(++currentVideo, lastVideo, message);
			        });
		        };

		        $('img', $this).removeClass('hidden');
		        worktable1.runElectroporator(function(videoNum, message) {
			        $('img', $this).addClass('hidden');
			        if(videoNum < 0) {
				        event.data.popupOKView.show('Kan ikke udføres', message);
				        return;
			        }
			        $('.video-container', view.$el).addClass('playing');
			        playVideos(0, videoNum, message);
		        });
	        };

	        self.activateHeater = function (event) {
		        var $this = $(this),
			        worktable1 = gameState.worktable1;
		        $('img', $this).removeClass('hidden');
		        worktable1.toggleHeater();
		        if(!worktable1.get('heater').status) {
			        $('img', $this).addClass('hidden');
		        }
	        };
        },

    });

    return Worktable1;
});
