define([
    'knockout',

    'controller/view/computer/Base',
    'controller/Popup',

    'model/GameState',
    'model/DNAElement',
    'model/type/Liquid',
    'model/type/Microorganism',
    'service/Localization'
], function (ko, BaseComputer, popupController, gameState, DNAElementModel, LiquidType, MicroorganismType,
             LocalizationService) {

    var Sequencing = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-sequencing', 'computer.screen.sequencing');

            self.isValid = ko.observable(false);
            self.message = ko.observable('');
            self.item = null;
            self.consumeItem = null;

            self.handleDrop = function (item, consumer) {

                self.item = item;
                self.consumeItem = consumer;
                self.isValid(true);

                self.sendToSequencing(item);

                self.consumeItem();

                return false;
            };

            self.sendToSequencing = function (tube) {
                if (!tube) return;
                // reset message and create new dna element
                var dna = null;
//TODO: uncomment! //TODO: figure how to get the optimal concentration from dilution

                console.log('TODO: tube.getTotalConc: '+ tube.getTotalConcentration());

                if (tube.getTotalConcentration() > 48) {
                    self.isValid(false);
                    popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.invalid_concentration');
                    return;
                }

                if (!tube.containsMicroorganism(MicroorganismType.MYELOMA)) {
                    self.isValid(false);
                    popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.missing_myeloma');
                    return;
                }

                if (!tube.hasOwnProperty('well') || !tube.well.hasAntibody()) {
                    console.log('TODO: remove #1');
                    self.isValid(false);
                    popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.missing_antibody');
                    return;
                }

                var myelomasWithAntibodies = _.filter(tube.liquids(), function(myeloma){
                    if (myeloma.type() !== LiquidType.MICROORGANISM)
                        return false;

                    if(myeloma.microorganismType() !== MicroorganismType.MYELOMA)
                        return false;

                    return myeloma.antibodiesFor().length > 0;
                });

                var antibodies = _.reduce(myelomasWithAntibodies, function(acc, myeloma) {
                    _.each(myeloma.antibodiesFor(), function(antibodyString) {
                        acc.push(antibodyString);
                    });

                    return acc;
                }, []);

                antibodies = _.unique(antibodies);

                if (_.contains(antibodies, LiquidType.ANTIBODY_GOUT)) {
                    dna = self.createDNAElement(LiquidType.ANTIBODY_GOUT);
                    popupController.message('computer.screen.sequencing.created_gout.header',
                        'computer.screen.sequencing.created_gout.body');
                } else { //if (_.contains(antibodies, LiquidType.ANTIBODY_SMALLPOX)) {
                    dna = self.createDNAElement(LiquidType.ANTIBODY_SMALLPOX);
                    popupController.message('computer.screen.sequencing.created_smallpox.header',
                        'computer.screen.sequencing.created_smallpox.body');
                }

                var alreadySequenced = _.any(self.gameState.sequencedDNA(), function(sequencedDNA) {
                    return sequencedDNA.name() === dna.name();
                });

                if (!alreadySequenced) {
                    self.gameState.sequencedDNA.push(dna);
                }

                self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_SEQUENCE, dna);
            };

            self.createDNAElement = function (type) {
                var icon = 'assets/images/icon_dna_dummy.png';
                var name = '';
                var pscType = '';
                var id = '';
                var link = '';
                var sequence = 'GATACA';
                switch (type) {
                case LiquidType.ANTIBODY_GOUT:
                    name = LocalizationService.text('liquid.name.antibody_gout');
                    pscType = 'ProteinCodingSequenceType.ANTIBODY_GOUT';
                    id = 'DNA_ANTIBODY_GOUT';
                    break;

                case LiquidType.ANTIBODY_SMALLPOX:
                    name = LocalizationService.text('liquid.name.antibody_smallpox');
                    pscType = 'ProteinCodingSequenceType.ANTIBODY_SMALLPOX';
                    id = 'DNA_ANTIBODY_SMALLPOX';
                    link = 'http://www.google.com/patents/EP2061511A2?cl=en';
                    sequence = 'aactatcatgtgcatctgatgtggcgcgatggcgataccagctataacccgaccctgaaaagcggcagcgaatattatggcctgctgggctatgtgatgggcgcgaaagcgagcaaaagcattagcaaaagcctggcgagcggcagcaccctgcagagccagcagcataacgaatatccggtgacc';
                    break;

                default:
                    throw 'Invalid dna element type: ' + type;
                }

                // TODO: correct values
                var dnaData = {
                    icon: icon,
                    type: 3,
                    comment: '',
                    link: link,
                    description: '',
                    sequence: 'GATTACA',
                    color: '#80c0f7',
                    name: name,
                    proteinCodingSequence: pscType
                };

                return new DNAElementModel(dnaData);
            };
        }
    });

    return Sequencing;
});
