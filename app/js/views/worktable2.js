/**
 * Backbone view controller for the workspace2 view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'chcdraggable',
	'chcdroppable',
	'globals',
	'text!../../templates/worktable2.html',
	'views/popup-ok',
	'models/microorganism',
	'models/container-content'
], function($, _, Backbone, chcDraggable, chcDroppable, Globals, worktable2ViewTemplate, popupOKView, Microorganism, ContainerContent) {
	var worktable2View = Backbone.View.extend({
		template: _.template(worktable2ViewTemplate),
		menuView: null,
		popupOKView: new popupOKView(),
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		updateSubviewElements: function() {
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			var variables = {
				title: 'Arbejdsplads 2'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);

			this.loadState();
		},
		bindEvents: function() {
			$('.worktable2-view .draggable').chcDraggable();
			$('.worktable2-view').on('chcDraggableStart.chcEvent', '.draggable', this, handleStartDrag);
			$('.worktable2-view').on('chcDraggableDroppedOut.chcEvent', '.draggable', this, handleDroppedOut);

			$('.worktable2-view .droppable').chcDroppable();
			$('.worktable2-view').on('chcDroppableDrop.chcEvent', '.droppable', this, handleDrop);

			$('.worktable2-view').on('click', '#worktable2-blender', this, toggleBlender);
		},
		unbindEvents: function() {
			$('.worktable2-view').off('click', '#worktable2-blender', toggleBlender);

			$('.worktable2-view').off('chcDraggableStart.chcEvent', '.draggable', handleStartDrag);
			$('.worktable2-view').off('chcDraggableDroppedOut.chcEvent', '.draggable', handleDroppedOut);
			$('.worktable2-view .draggable').chcDraggable('destroy');

			$('.worktable2-view').off('chcDroppableDrop.chcEvent', '.droppable', handleDrop);
			$('.worktable2-view .droppable').chcDroppable('destroy');
		},
		loadState: function() {
			renderTable();
			renderTubeHolder();
			renderCentrifuge();
			renderOD();
		}
	});
	
	return worktable2View;

	function renderTable() {
		var worktable2 = Globals.lab.get('worktable2'),
			$table = $('#worktable2-table'),
			i, emptyOrFull, $petridish;
		for(i = 0; i < worktable2.attributes.tableItems.length; i++) {
			emptyOrFull = 'empty';
			if(worktable2.attributes.tableItems[i] !== null) {
				if(worktable2.attributes.tableItems[i].hasContent()) {
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
	}

	function renderTubeHolder() {
		var worktable2 = Globals.lab.get('worktable2'),
			testTubes = worktable2.attributes.testTubes,
			i, emptyOrFull;
		for(i = 0; i < testTubes.length; i++) {
			emptyOrFull = 'empty';
			if(testTubes[i] !== null) {
				if(testTubes[i].hasContent()) {
					emptyOrFull = 'full';
				}
				$('#worktable2-testtubeholder ul li:nth-child(' + (i + 1) + ')').html('<div class="draggable testtube"><img src="img/worktable1_testtube_' + (i + 1) + '_' + emptyOrFull + '.png" alt="Test tube" /></div>');
			}
		}
	}

	function renderCentrifuge() {
		var worktable2 = Globals.lab.get('worktable2'),
			tubeCount = worktable2.getCentrifugeTubeCount(),
			$centifugeTubes;
		if(tubeCount <= 0) {
			return;
		}
		$centifugeTubes = $('<div class="draggable testtube"><img  src="img/work2_centrifuge-slot' + tubeCount + '.png" /></div>');
		$('#worktable2-centrifuge').html($centifugeTubes);
	}

	function renderOD() {
		var worktable2 = Globals.lab.get('worktable2'),
			$tube;
		if(!worktable2.isODEmpty()) {
			$tube = $('<div class="testtube draggable"><img src="img/work2_od-on.png" /></div>');
			$('#worktable2-od').html($tube);
			$tube.chcDraggable();
			
			$display = $('#worktable2-od-display');
			$display.removeClass('hidden');
			$display.html(worktable2.getTubeFromOD().getContent().totalLogConcentration.toFixed(1));
		}
	}
	
	/* !EVENT HANDLERS */

	function handleDrop(event, $draggable) {
		var view = event.data,
			$droppable = $(this),
			droppableID = $droppable.attr('id');

		event.stopPropagation();
		event.preventDefault();
		
		if(droppableID === 'worktable2-table') {
			handleDropOnTable(view, $droppable, $draggable);
			return;
		}
		if($droppable.hasClass('petridish')) {
			handleDropOnPetridish(view, $droppable, $draggable);
			return;
		}
		if($droppable.hasClass('testtubeholder-slot')) {
			handleDropOnTestTubeHolder(view, $droppable, $draggable);
			return;
		}
		if(droppableID === 'worktable2-centrifuge') {
			handleDropOnCentrifuge(view, $droppable, $draggable);
			return;
		}
		if(droppableID === 'worktable2-od') {
			handleDropOnOD(view, $droppable, $draggable);
			return;
		}
	}

	function handleDropOnTable(view, $table, $draggable) {
		var worktable2 = Globals.lab.get('worktable2');

		if($draggable.hasClass('petridish')) {
			var position = worktable2.addPetridish($draggable.data('content'));
			if(position >= 0) {
				$draggable.removeAttr('style');
				$draggable.removeClass('draggablespawn draggablespawn-popuplist');
				$draggable.off();
				$draggable.chcDraggable('destroy');

				$draggable.chcDraggable();
				if(worktable2.isPetridishEmpty(position)) {
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
	}

	function handleDropOnPetridish(view, $petridish, $draggable) {
		var lab = Globals.lab,
			worktable2 = lab.get('worktable2'),
			position = $petridish.data('tablePosition'),
			content;

		if($draggable.hasClass('dna')) {
			worktable2.fillPetridish(position, new ContainerContent({genes: [$draggable.data('DNA')]}));
			$petridish.html('<img src="img/petri_full.png" />');
			$draggable.remove();
			return;
		}

		if($draggable.hasClass('yeastcells')) {
			content = $draggable.data('content');
			if(worktable2.hasPetridishPlaceFor(position, content)) {
				worktable2.fillPetridish(position, content);
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
			worktable2.fillPetridish(position, content);
			$petridish.html('<img src="img/petri_full.png" />');
			$draggable.remove();
			return;
		}

		if($draggable.hasClass('pipette') && lab.hasPipetteTip()) {
			if(lab.isPipetteFull()) {
				if(worktable2.hasPetridishPlaceFor(position, lab.get('pipette').content)) {
					content = lab.emptyPipette('petridish');
					if(!content.isEmpty()) {
						worktable2.fillPetridish(position, content);
						$petridish.html('<img src="img/petri_full.png" />');
					}
				}
				else {
					view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i petriskålen.');
				}
			}
			else {
				if(!worktable2.isPetridishEmpty(position)) {
					lab.fillPipette(worktable2.getTableItem(position).getContent());
					//worktable2.emptyPetridish(position);
					//$petridish.html('<img src="img/petri_empty.png" />');
				}
			}
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleDropOnTestTubeHolder(view, $testTubeHolderSlot, $draggable) {
		var lab = Globals.lab,
			worktable2 = lab.get('worktable2'),
			emptyOrFull = 'empty',
			position, content;

		position = $testTubeHolderSlot.index();

		if($draggable.hasClass('testtube')) {
			content = $draggable.data('content');
			if(worktable2.addTestTubeAtPos(content, position) === true) {
				$draggable.removeAttr('style');
				$draggable.removeClass('draggablespawn draggablespawn-popuplist');
				$draggable.off();
				$draggable.chcDraggable('destroy');
				$draggable.chcDraggable();
				if(content.hasContent()) {
					emptyOrFull = 'full';
				}
				$draggable.html('<img src="img/worktable1_testtube_' + (position + 1) + '_' + emptyOrFull + '.png" alt="Test tube" />');
				$testTubeHolderSlot.append($draggable);
				return;
			}
		}

		if($draggable.hasClass('dna')) {
			if(!worktable2.isTestTubeSlotEmpty(position)) {
				worktable2.fillTube(position, new ContainerContent({genes: [$draggable.data('DNA')]}));
				$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				$draggable.remove();
				return;
			}
		}

		if($draggable.hasClass('yeastcells')) {
			if(!worktable2.isTestTubeSlotEmpty(position)) {
				content = $draggable.data('content');
				if(worktable2.hasTubePlaceFor(position, content)) {
					worktable2.fillTube(position, content);
					$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
					$draggable.remove();
					return;
				}
				else {
					view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i reagensglasset.');
				}
			}
		}

		if($draggable.hasClass('antibiotic')) {
			if(!worktable2.isTestTubeSlotEmpty(position)) {
				content = $draggable.data('content');
				worktable2.fillTube(position, content);
				$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				$draggable.remove();
				return;
			}
		}

		if($draggable.hasClass('pipette')) {
			if(!worktable2.isTestTubeSlotEmpty(position) && lab.hasPipetteTip()) {
				if(lab.isPipetteFull()) {
					if(worktable2.hasTubePlaceFor(position, lab.get('pipette').content)) {
						content = lab.emptyPipette('tube');
						if(!content.isEmpty()) {
							worktable2.fillTube(position, content);
							$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
						}
					}
					else {
						view.popupOKView.show('Kan ikke udføres', 'Der er ikke mere plads i reagensglasset');
					}
				}
				else {
					if(!worktable2.isTubeEmpty(position)) {
						lab.fillPipette(worktable2.getTube(position).getContent());
						//worktable2.emptyTube(position);
						//$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_empty.png" alt="Test tube" />');
					}
				}
			}
		}

		if($draggable.hasClass('needle')) {
			if(!worktable2.isTestTubeSlotEmpty(position)) {
				$draggable.data('content', worktable2.getTube(position).getContent());

				console.log('Added content to needle');
				console.log($draggable.data('content'));
				worktable2.emptyTube(position);
				$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_empty.png" alt="Test tube" />');
			}
		}

		if($draggable.hasClass('death')) {
			if(!worktable2.isTestTubeSlotEmpty(position)) {
				worktable2.fillTube(position, $draggable.data('content'));
				$('#worktable2-testtubeholder ul li:nth-child(' + (position + 1) + ') .draggable').html('<img src="img/worktable1_testtube_' + (position + 1) + '_full.png" alt="Test tube" />');
				$draggable.remove();
				return;
			}
		}
		
		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleDropOnCentrifuge(view, $centrifuge, $draggable) {
		var worktable2 = Globals.lab.get('worktable2'),
			top, left;

		if($draggable.hasClass('testtube')) {
			var tubeCount = worktable2.addTubeToCentrifuge($draggable.data('content'));
			if(tubeCount > 0) {
				$draggable.removeAttr('style');
				$draggable.removeClass('draggablespawn draggablespawn-popuplist');
				$draggable.off();
				$draggable.chcDraggable('destroy');

				$draggable.chcDraggable();
				$draggable.html('<img  src="img/work2_centrifuge-slot' + tubeCount + '.png" />');
				$draggable.data('centrifugeTubeCount', tubeCount);
				$centrifuge.html($draggable);
				return;
			}
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleDropOnOD(view, $OD, $draggable) {
		var worktable2 = Globals.lab.get('worktable2'),
			$display, content;
		if($draggable.hasClass('testtube') && worktable2.isODEmpty()) {
			content = $draggable.data('content');
			worktable2.addTubeToOD(content);
			$draggable.removeAttr('style');
			$draggable.removeClass('draggablespawn draggablespawn-popuplist');
			$draggable.off();
			$draggable.chcDraggable('destroy');
			$draggable.html('<img src="img/work2_od-on.png" />');
			$draggable.chcDraggable();
			$OD.html($draggable);
			
			$display = $('#worktable2-od-display');
			$display.removeClass('hidden');
			$display.html(content.getContent().totalLogConcentration.toFixed(1));
			return;
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleStartDrag(event) {
		var $draggable = $(this),
			worktable2 = Globals.lab.get('worktable2'),
			$parent = $draggable.parent(),
			position, tubeCount, $replacement;

		$draggable.chcDroppable('destroy');
		$draggable.removeClass('droppable');
		$draggable.data('parent', $parent);

		if($draggable.hasClass('petridish')) {
			position = $draggable.data('tablePosition');
			$draggable.html('<img src="img/icon_cup_petri.png" />');
			$draggable.data('content', worktable2.getTableItem(position));
			worktable2.removeTableItem(position);
		}

		if($draggable.hasClass('testtube') && $parent.hasClass('testtubeholder-slot')) {
			position = $draggable.parent().index();
			$draggable.data('tubeholderPosition', position);
			$draggable.data('content', worktable2.getTube(position));

			$draggable.html('<img src="img/icon_cup_tube.png" />');
			worktable2.removeTestTubeAtPos(position);
		}

		if($draggable.hasClass('testtube') && $parent.attr('id') === 'worktable2-centrifuge') {
			$draggable.data('content', worktable2.getTubeFromCentrifuge());
			worktable2.removeTubeFromCentrifuge();
			$draggable.html('<img src="img/icon_cup_tube.png" />');
			tubeCount = worktable2.getCentrifugeTubeCount();
			if(tubeCount > 0) {
				$replacement = $('<div class="draggable testtube"><img  src="img/work2_centrifuge-slot' + tubeCount + '.png" /></div>');
				setTimeout(function(event) {
					$parent.html($replacement);
					$replacement.chcDraggable();
				}, 1);
			}
		}

		if($draggable.hasClass('testtube') && $parent.attr('id') === 'worktable2-od') {
			$draggable.html('<img src="img/icon_cup_tube.png" />');
			$draggable.data('content', worktable2.getTubeFromOD());
			worktable2.emptyOD();
			$('#worktable2-od-display').addClass('hidden');
		}
	}

	function handleDroppedOut(event) {
		var $draggable = $(this),
			$parent = $draggable.data('parent'),
			worktable2 = Globals.lab.get('worktable2'),
			emptyOrFull = 'empty',
			position, tubeCount;

		if($draggable.hasClass('petridish')) {
			position = worktable2.addPetridish($draggable.data('content'));
			if(worktable2.attributes.tableItems[position].hasContent()) {
				emptyOrFull = 'full';
			}
			$draggable.html('<img src="img/petri_' + emptyOrFull + '.png" />');
			$draggable.data('tablePosition', position);
			$draggable.addClass('droppable');
			$draggable.chcDroppable();
			$parent.append($draggable);
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
			worktable2.addTestTubeAtPos($draggable.data('content'), position);
			if(worktable2.attributes.testTubes[position].hasContent()) {
				emptyOrFull = 'full';
			}
			$draggable.html('<img src="img/worktable1_testtube_' + (position + 1) + '_' + emptyOrFull + '.png" alt="Test tube" />');
		}

		if($draggable.hasClass('testtube') && $parent.attr('id') === 'worktable2-centrifuge') {
			tubeCount = worktable2.addTubeToCentrifuge($draggable.data('content'));
			$draggable.html('<img  src="img/work2_centrifuge-slot' + tubeCount + '.png" />');
			$parent.html($draggable);
			$draggable.chcDraggable(); //FIXME: this should not be necessary
		}

		if($draggable.hasClass('testtube') && $parent.attr('id') === 'worktable2-od') {
			content = $draggable.data('content');
			worktable2.addTubeToOD(content);
			$draggable.removeAttr('style');
			$draggable.removeClass('draggablespawn draggablespawn-popuplist');
			$draggable.off();
			$draggable.chcDraggable('destroy');
			$draggable.html('<img src="img/work2_od-on.png" />');
			$parent.html($draggable);
			$draggable.chcDraggable();
			
			$display = $('#worktable2-od-display');
			$display.removeClass('hidden');
			$display.html(content.getContent().totalLogConcentration.toFixed(1));
		}
	}

	function toggleBlender(event) {
		var $blender = $(this);
		if($blender.hasClass('on')) {
			$blender.removeClass('on');
		}
		else {
			$blender.addClass('on');
		}
	}
});
