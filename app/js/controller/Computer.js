define([
    'knockout',
    'mapping',
    'jquery',
    'lodash',

    'controller/Base',

    'model/Gene',
    'model/GameState',
    'model/InventoryItem',

    'service/DNA',
    'utils/utils'
], function (ko, mapping, $, _, BaseController, Gene, gameState, InventoryItem, DNAService, utils) {
    var Computer = BaseController.extend({

        dnaService: new DNAService(),

        availableDNA: ko.observableArray([]),

        activeScreen: ko.observable('menu'),
        activeGene: ko.observable(new Gene()), // TODO: just make this an observableArray

        constructor: function () {
            var self = this;

            self.changeScreen = function (name) {
                self.activeScreen(name);
            };

            self.dnaService.getDNAElements()
                .done(function (elements) {
                    self.availableDNA(elements);
                });

            self.handleDrop = function (event, $draggable) {
                //On iPad there is a delay if we do not wait for last draw cycle to complete
		        setTimeout(function() {
                    var dna = _.find(self.availableDNA(), function (d) {
                        return d.id() === $draggable.data('dnaelementid');
                    });

                    var clone = utils.klone(dna);
                    self.activeGene().dnaElements.push(clone);

			        $draggable.remove();
		        }, 1);

		        // DETECT MOUSE OVER ON DROPAREA ONLY WHEN IN DRAG MODE, THEN
                // EITHER APPEND OR PREPEND CUE TO ELEMENT BASED ON MOUSE POSITION // TODO: wat?
            };

            self.removeDNA = function (dna) {
                self.activeGene().dnaElements.remove(dna);
            };

            self.orderDNA = function () {
                // TODO: validate DNA?

                var geneClone = utils.klone(self.activeGene());
                var item = new InventoryItem("dna", geneClone);
                gameState.addInventoryItem(item);

                // reset the gene and go to computer menu
                self.activeGene().dnaElements.removeAll();
                self.activeScreen('menu');
	        };
	    }
    });

    return Computer;
});
