define([
    'jquery',
    'lodash',
    'mapping',
    'service/Base',
    'model/ContainerContent',
    'model/Container',
    'model/Microorganism'
], function ($, _, mapping, BaseService, ContainerContent, Container, Microorganism) {
    // var ChemicalService = BaseService.extend({
    //     getClosetItems: function () {
    //         var promise = $.Deferred();

    //         var things = [{
	// 			name: 'Antibiotikum',
	// 			klass: 'antibiotic',
	// 			icon: 'img/icon_antibiotic_g418.png',
	// 			content: new ContainerContent({
	// 				other: ['antibiotic']
	// 			})
	// 		}, {
	// 			name: 'Dødelig reagens',
	// 			klass: 'death',
	// 			icon: 'img/icon_death.png',
	// 			content: new ContainerContent({
	// 				other: ['death']
	// 			})
	// 		}];

    //         var items = _.map(things, function (thing) {
    //             //return new InventoryItem(thing);
    //         });

    //         promise.resolve(items);

    //         return promise;
    //     },

    //     getDrawerItems: function () {
    //         var promise = $.Deferred();

    //         var things = [{
	// 			name: 'Kanyle',
	// 			klass: 'needle',
	// 			icon: 'img/icon_med_inj.png',
	// 			content: null
	// 		}, {
	// 			name: 'Petriskål',
	// 			klass: 'petridish',
	// 			icon: 'img/icon_cup_petri.png',
	// 			content: new Container({maxConcentration: 10, maxBiomass: 1.01})
	// 		}, {
	// 			name: 'Reagensglas',
	// 			klass: 'testtube',
	// 			icon: 'img/icon_cup_tube.png',
	// 			content: new Container()
	// 		}, {
	// 			name: 'Mikrotiterbakke',
	// 			klass: 'microtiterplate',
	// 			icon: 'img/icon_cup_mkrt.png',
	// 			content: null
	// 		}, {
	// 			name: 'Skalpel',
	// 			klass: 'scalpel',
	// 			icon: 'img/icon_scalpel.png',
	// 			content: null
	// 		}];

    //         var items = _.map(things, function (thing) {
    //             return new InventoryItem(thing);
    //         });

    //         promise.resolve(items);

    //         return promise;
    //     },

    //     getFridgeItems: function () {
    //         var promise = $.Deferred();

    //         var item = new InventoryItem({
	// 			name: 'Gærceller',
	// 			klass: 'yeastcells',
	// 			icon: 'img/icon_cells_yeast.png',
	// 			content: new ContainerContent({
	// 				genes: [],
	// 				microorganisms:	[
	// 					new Microorganism({
	// 						name: 'yeastcells',
	// 						optimalPh: 6,
	// 						maxpH: 7.5,
	// 						minpH: 4,
	// 						optimalTemp: 28,
	// 						minTemp: 10,
	// 						maxTemp: 36,
	// 						logConcentration: 2.0
	// 					})
	// 				]
	// 			})
    //         });

    //         promise.resolve([item]);

    //         return promise;
    //     }

    // });

    // return ChemicalService;
});
