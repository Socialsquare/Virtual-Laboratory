define([
    'knockout',
    'lodash',

    'controller/view/computer/Base',
    'controller/Popup',

    'model/Gene',
    'model/Tube',

    'service/DNA',
    'utils/utils'

], function (ko, _, BaseComputer, popupController, GeneModel, TubeModel, DNAService, utils) {

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

            self.moveDnaLeft = function (dna) {
                self.moveDna(dna, -1);
            };

            self.moveDnaRight = function (dna) {
                self.moveDna(dna, 1);
            };

            self.moveDna = function(dna, direction) {
                var dnaSequence = self.dnaSequence();

                var matchIndex = _.findIndex(dnaSequence, function(dnaElement) {
                    return dna === dnaElement;
                });

                if (matchIndex === -1) {
                    console.log('TODO: dna not found.');
                    return;
                } else if (matchIndex === dnaSequence.length - 1 && direction > 0) {
                    // Wanting to move right, but dna is already the rightmost element
                    return;
                } else if (matchIndex === 0 && direction < 0) {
                    return;
                }

                var newIndex = matchIndex + direction;

                // swap this and the one in the given direction
                var tempDna = dnaSequence[newIndex];

                dnaSequence[newIndex] = dna;
                dnaSequence[matchIndex] = tempDna;

                self.dnaSequence(dnaSequence);
            };

            self.removeDNA = function (dna) {
                self.dnaSequence.remove(dna);
            };

            self.showInfo = function (dna) {
                self.popupController.dnaInfo(dna);
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

                self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_DNA, tube);
            };
        }
    });

    return DesignDNA;
});
