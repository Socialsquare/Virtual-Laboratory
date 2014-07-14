define([
    'knockout',
    'controller/view/computer/Base',

    'model/Gene',
    'model/Tube',
    'model/GameState',

    'service/DNA',
    'utils/utils',
    'utils/DragHelper'
], function (ko, BaseComputer, GeneModel, TubeModel, gameState, DNAService, utils, DragHelper) {

    var DesignDNA = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-design-dna');

            self.DragHelper = DragHelper;

            self.dnaService = new DNAService();
            self.availableDNA = ko.observableArray([]);
            self.dnaSequence = ko.observableArray([]);

            self.dnaService.getDNAElements()
                .done(function (elements) {
                    self.availableDNA(elements);
                });

            self.handleDrop = function (dna) {
                //TODO: On iPad there is a delay if we do not wait for last draw cycle to complete
                var clone = utils.klone(dna);
                self.dnaSequence.push(clone);
            };

            self.removeDNA = function (dna) {
                self.dnaSequence.remove(dna);
            };

            self.orderDNA = function () {
                // clone sequence, add to gene, put in tube
                var sequenceClone = ko.toJS(self.dnaSequence);
                var gene = new GeneModel(sequenceClone);
                var tube = new TubeModel();
                tube.add(gene);
                gameState.inventory.add(tube);

                // reset the sequence and go to computer menu
                self.dnaSequence.removeAll();

                self.goToMenu();
	        };
        }
    });

    return DesignDNA;
});
