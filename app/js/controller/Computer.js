define([
    'knockout',
    'jquery',
    'lodash',
    'controller/Base',
    'model/Gene',
    'service/DNA',

    // self-registering jquery plugins
	'chcdraggable',
	'chcdraggablespawner',
	'chcdroppable'
], function (ko, $, _, BaseController, Gene, DNAService) {
    var Computer = BaseController.extend({

        dnaService: new DNAService(),

        activeScreen: ko.observable('menu'),
        activeGene: ko.observable(new Gene()),

        availableDNA: ko.observableArray([]),

        constructor: function () {
            var self = this;
            self.base(1, 'computer');

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

                    self.activeGene().dnaElements.push(dna);

			        $draggable.remove();
		        }, 1);

		        // DETECT MOUSE OVER ON DROPAREA ONLY WHEN IN DRAG MODE, THEN
                // EITHER APPEND OR PREPEND CUE TO ELEMENT BASED ON MOUSE POSITION // TODO: wat?
            };

            self.removeDNA = function (dna) {
                self.activeGene().dnaElements.remove(dna);
            };
	    },

        handleOrderDNA: function (event) {
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

    return Computer;
});
