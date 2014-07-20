define([
    'knockout',
    'lodash',
    'controller/view/computer/Base',

    'model/Gene',
    'model/Tube',

    'service/DNA',
    'utils/utils'

], function (ko, _, BaseComputer, GeneModel, TubeModel, DNAService, utils) {

    var DesignDNA = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-design-dna', 'computer.screen.dna');

            self.dnaService = new DNAService();
            self.defaultAvailableDNA = ko.observableArray([]);
            self.dnaSequence = ko.observableArray([]);

            self.availableDNA = ko.computed(function () {
                return _.union(self.defaultAvailableDNA(), self.gameState.sequencedDNA());
            });

            self.defaultAvailableDNA(self.dnaService.getDNAElements());

            self.handleDrop = function (dna) {
                //TODO: On iPad there is a delay if we do not wait for last draw cycle to complete
                var clone = dna.clone();//TODO: test
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
                tube.add(gene, true);
                self.gameState.inventory.add(tube);

                // reset the sequence and go to computer menu
                self.dnaSequence.removeAll();

                self.changeScreen(self.Screens.MENU);

                self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_DNA);
            };
        }
    });

    return DesignDNA;
});
