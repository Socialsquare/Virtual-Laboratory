/**
 * Backbone view controller for the computer view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'chcdraggable',
	'chcdraggablespawner',
	'chcdroppable',
	'globals',
	'text!../../templates/computer.html',
	'collections/dnaelements',
	'models/dnaelement',
	'models/gene',
	'views/popup-quiz'
], function($, _, Backbone, chcDraggable, chcDraggableSpawner, chcDroppable, Globals, computerViewTemplate, DNAElements, DNAElement, Gene, popupQuizView) {
	var computerView = Backbone.View.extend({
		template: _.template(computerViewTemplate),
		currentView: '#computer-mainmenu',
		DNAElements: null,
		popupQuiz: new popupQuizView(),
		initialize: function(options) {
			this.viewID = options.viewID;
			this.DNAElements = new DNAElements();
			this.DNAElements.on('add', function() {
				this.renderTemplate();
			}, this);
			this.DNAElements.fetch();
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
				title: 'Computeren'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);

			var $DNAElementList = $('#computer-designdna .dna-element-list');
			this.DNAElements.each(function(DNAElement) {
				$DNAElementList.append('<li><div class="draggablespawner" data-dnaelementid="' + DNAElement.get('id') + '">' + DNAElement.get('name') + '</div></li>');
			});
		},
		bindEvents: function() {
			//$('body').on('click', '#quiz-test-link', this, showQuiz);
			$('body').on('click', '#order-mouse', this, gotoOrderMouse);
			$('body').on('click', '#design-dna', this, gotoDesignDNA);
			$('body').on('click', '#computer-ordermouse ul li a', selectMouse);
			$('body').on('click', '.computer-header-container .menu-link', this, goBackToMenu);
			
			$('.computer-screen .draggablespawner').chcDraggableSpawner({styleClass: 'draggablespawn-computer'});


			$('.computer-screen .droppable').chcDroppable();
			$('.droparea').on('chcDroppableDrop.chcEvent', null, this, handleDrop);

			$('.computer-screen').on('click', '.dna-element', this, handleDNAElementSelect);
			$('.computer-screen').on('click', '.remove-btn', this, handleDNAElementRemove);
			$('.computer-screen').on('click', '#order-btn-DNA', this, handleOrderDNA);
		},
		unbindEvents: function() {
			$('.computer-screen .droppable').chcDroppable('destroy');

			//$('body').off('click', '#quiz-test-link', showQuiz);
			$('body').off('click', '#order-mouse', gotoOrderMouse);
			$('body').off('click', '#design-dna', gotoDesignDNA);
			$('body').off('click', '#computer-ordermouse ul li a', selectMouse);
			$('body').off('click', '.computer-header-container .menu-link', goBackToMenu);
		}
	});
	
	return computerView;
	
	/* !EVENT HANDLERS */
	
	function showQuiz(event) {
		event.preventDefault();
		event.data.popupQuiz.show();
	}

	function gotoOrderMouse(event) {
		event.preventDefault();
		$('#computer-mainmenu').addClass('hidden');
		$('#computer-ordermouse').removeClass('hidden');
		event.data.currentView = '#computer-ordermouse';
	}

	function gotoDesignDNA(event) {
		event.preventDefault();
		$('#computer-mainmenu').addClass('hidden');
		$('#computer-designdna').removeClass('hidden');
		event.data.currentView = '#computer-designdna';
	}

	function selectMouse(event) {
		event.preventDefault();
		var $this = $(this);
		var selectedMouseType = $this.data('mouse');
		$('#computer-ordermouse ul li a div').removeClass('selected');
		$this.find('div').addClass('selected');
		$('#computer-ordermouse .detail div').addClass('hidden');
		$('#computer-ordermouse .detail .' + selectedMouseType).removeClass('hidden');
	}

	function goBackToMenu(event) {
		event.preventDefault();
		$(event.data.currentView).addClass('hidden');
		$('#computer-mainmenu').removeClass('hidden');
	}

	function handleDrop(event, $draggable) {
		setTimeout(function() { //On iPad there is a delay if we do not wait for last draw cycle to complete	
			var DNAElement = event.data.DNAElements.get($draggable.data('dnaelementid'));
			var $DNAElement = $('<div class="dna-element" id="dna-element-' + DNAElement.get('id') + '" data-dnaelementid="' + DNAElement.get('id') + '"></div>');
			$DNAElement.html('<div class="dna-element-img"></div><div class="dna-element-name">' + $draggable.html() + '</div>');
			$DNAElement.find('.dna-element-img').css({
				'background-color': DNAElement.get('color')
			});

			if($('#computer-designdna .detail .droparea p').length > 0) {
				$('#computer-designdna .detail .droparea').empty();
			}
			$('#computer-designdna .detail .droparea').append($DNAElement);

			$draggable.remove();
			var $sequence = $('<span data-dnaid="' + DNAElement.get('id') + '">' + DNAElement.get('sequence') + '</span>');
			$sequence.css({
				'color': DNAElement.get('color')
			});
			$('#computer-designdna .detail .sequence').append($sequence);
		}, 1);

		//DETECT MOUSE OVER ON DROPAREA ONLY WHEN IN DRAG MODE, THEN EITHER APPEND OR PREPEND CUE TO ELEMENT BASED ON MOUSE POSITION
	}

	function handleDNAElementSelect(event) {
		var $this = $(this);
		var DNAElement = event.data.DNAElements.get($this.data('dnaelementid'));
		$this.append('<button class="remove-btn" data-dnaelementid="' + DNAElement.get('id') + '">X</button>');
	}

	function handleDNAElementRemove(event) {
		var $this = $(this);
		var DNAElement = event.data.DNAElements.get($this.data('dnaelementid'));
		$('#dna-element-' + DNAElement.get('id')).remove();
		$('#sequence-' + DNAElement.get('id')).remove();
	}

	function handleOrderDNA(event) {
		//Add DNA to inventory, Create DNA collection and add, add id to object for retrieval.
		var $dna = $('<div class="draggable dna" id="dna"><img src="img/icon_dna.png" /></div>');
		var DNAElements = event.data.DNAElements;
		var DNA = [];
		$('#computer-dnasequence span').each(function() {
			var DNAId = $(this).data('dnaid');
			DNA.push(DNAElements.get(DNAId));
		});
		$dna.data('DNA', new Gene(DNA));
		Globals.menuView.addItemToInventory($dna);

		$(document.body).trigger('task:INST_COMPUTER:ACTION_ORDERDNA');
	}
});