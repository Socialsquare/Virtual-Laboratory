define([
    'knockout',

    'controller/view/computer/Base',
    'controller/Popup',

    'model/GameState',
    'model/DNAElement',
    'model/type/Liquid',
    'model/type/Microorganism'
], function (ko, BaseComputer, popupController, gameState, DNAElementModel, LiquidType, MicroorganismType) {

    var Sequencing = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-sequencing');

            self.message = ko.observable('');

            self.handleDrop = function (item) {
                if (item.getTotalConcentration() >= 10) {
                    self.message('computer.screen.sequencing.invalid_concentration');
                    return false;
                }

                if (!item.containsMicroorganism(MicroorganismType.MYELOMA)) {
                    self.message('computer.screen.sequencing.missing_myeloma');
                    return false;
                }

                if (!item.contains(LiquidType.ANTIBODY_GOUT) && !item.contains(LiquidType.ANTIBODY_SMALLPOX)) {
                    self.message('computer.screen.sequencing.missing_antibody');
                    return false;
                }

                // reset message and create new dna element
                var dna = null;
                if (item.contains(LiquidType.ANTIBODY_GOUT)) {
                    dna = self.createDNAElement(LiquidType.ANTIBODY_GOUT);
                    popupController.message('computer.screen.sequencing.created_gout.header',
                                            'computer.screen.sequencing.created_gout.body');
                }
                else if (item.contains(LiquidType.ANTIBODY_SMALLPOX)) {
                    dna = self.createDNAElement(LiquidType.ANTIBODY_SMALLPOX);
                    popupController.message('computer.screen.sequencing.created_smallpox.header',
                                            'computer.screen.sequencing.created_smallpox.body');
                }
                // TODO: maybe check if it exists already?
                self.gameState.sequencedDNA.push(dna);
                self.message('');
            };

            self.createDNAElement = function (type) {
                var name = '';
                switch (type) {
                case LiquidType.ANTIBODY_GOUT:
                    name = 'gout';
                    break;

                case LiquidType.ANTIBODY_SMALLPOX:
                    name = 'smallpox';
                    break;

                default:
                    throw 'Invalid dna element type: ' + type;
                }

                // TODO: correct values
                var dnaData = {
                    name: name,
			        color: 'black',
			        sequence: 'GATTACA',
			        description: '',
			        link: '',
			        comment: ''
                };

                return new DNAElementModel(dnaData);
            };

            self.sendForSequencing = function () {

            };
        }
    });

    return Sequencing;
});
