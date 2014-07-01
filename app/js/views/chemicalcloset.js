/**
 * Backbone view controller for the chemical closet view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/chemicalcloset.html',
	'views/popup-list',
	'models/container',
	'models/container-content',
	'models/microorganism'
], function($, _, Backbone, Globals, chemicalClosetViewTemplate, popupListView, Container, ContainerContent, Microorganism) {
	var chemicalClosetView = Backbone.View.extend({
		template: _.template(chemicalClosetViewTemplate),
		popupList: null,
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
			if(this.popupList !== null) {
				this.popupList.close();
			}
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
				title: 'Kemikalie-skab'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
			$('.chemicalcloset-link').on('click', null, this, handleChemicalClosetClick);
		},
		unbindEvents: function() {
			$('.chemicalcloset-link').off('click', handleChemicalClosetClick);
		}
	});
	
	return chemicalClosetView;

	function handleChemicalClosetClick(event) {
		var id = $(this).attr('id');
		var title = '';
		var listItems = [];
		switch(id) {
			case 'chemicalcloset-closet-link':
				title = 'Kemikalie skabet';
				listItems = [{
					name: 'Antibiotikum',
					identifierClass: 'antibiotic',
					dragImg: 'icon_antibiotic_g418.png',
					content: new ContainerContent({
						other: ['antibiotic']
					})
				}, {
					name: 'Dødelig reagens',
					identifierClass: 'death',
					dragImg: 'icon_death.png',
					content: new ContainerContent({
						other: ['death']
					})
				}];
				break;
			case 'chemicalcloset-fridge-link':
				title = 'Køleskabet';
				listItems = [{
					name: 'Gærceller',
					identifierClass: 'yeastcells',
					dragImg: 'icon_cells_yeast.png',
					content: new ContainerContent({
						genes: [],
						microorganisms:	[
							new Microorganism({
								name: 'yeastcells',
								optimalpH: 6,
								maxpH: 7.5,
								minpH: 4,
								optimalTemp: 28,
								minTemp: 10,
								maxTemp: 36,
								logConcentration: 2.0
							})
						]
					})
				}];
				break;
			case 'chemicalcloset-drawer-link':
				title = 'Skuffen';
				listItems = [{
					name: 'Kanyle',
					identifierClass: 'needle',
					dragImg: 'icon_med_inj.png',
					content: null
				}, {
					name: 'Petriskål',
					identifierClass: 'petridish',
					dragImg: 'icon_cup_petri.png',
					content: new Container({maxConcentration: 10, maxBiomass: 1.01})
				}, {
					name: 'Reagensglas',
					identifierClass: 'testtube',
					dragImg: 'icon_cup_tube.png',
					content: new Container()
				}, {
					name: 'Mikrotiterbakke',
					identifierClass: 'microtiterplate',
					dragImg: 'icon_cup_mkrt.png',
					content: null
				}, {
					name: 'Skalpel',
					identifierClass: 'scalpel',
					dragImg: 'icon_scalpel.png',
					content: null
				}];
				break;
		}
		event.data.popupList = new popupListView({
			title: title,
			listItems: listItems
		});
		event.data.popupList.show();
	}
});