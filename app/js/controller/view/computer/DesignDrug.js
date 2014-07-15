define([
    'knockout',
    'controller/view/computer/Base'

], function (ko, BaseComputer) {

    var DesignDrug = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-design-drug');

            self.imageGetter = self.ImageHelper.drugSideGroup;

            self.sidegroups = [
                { name: '14' },
                { name: '14R' },
                { name: '15' },
                { name: '15R' },
                { name: '4' },
                { name: '4R' },
                { name: '5' },
                { name: '5R' }
            ];

            self.handleDrop = function (group) {
                // var clone = utils.klone(group);
                // self.sequence.push(clone);
            };

            self.order = function () {
                console.log('TODO: order drugz');

                // clone sequence, add to gene, put in tube
                // var sequenceClone = ko.toJS(self.dnaSequence);
                // var gene = new GeneModel(sequenceClone);
                // var tube = new TubeModel();
                // tube.add(gene);
                // self.gameState.inventory.add(tube);

                // // reset the sequence and go to computer menu
                // self.dnaSequence.removeAll();

                // self.goToMenu();
            };
        }
    });

    return DesignDrug;
});
