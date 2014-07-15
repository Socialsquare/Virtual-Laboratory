define([
	'knockout',
    'lodash',
    'model/Liquid',
    'model/type/Liquid',
    'model/type/DNA',
    'model/ReactionCount',
], function(ko, _, LiquidModel, LiquidType, DNAType, ReactionCount) {

    var Gene = LiquidModel.extend({
        constructor: function (elements) {
            var self = this;
            // TODO: patty: correct reaction count?
            self.base(LiquidType.GENE, ReactionCount.NEVER);
            self.dnaElements = ko.observableArray(elements || []);

            // Tested/Validated
            self.getPromoterPositions = function() {
                var positions = [];
                _(self.dnaElements()).each(function(dna, index){
                    if(dna.DNAType === DNAType.PROMOTER) {
                        positions.push(index);
                    }
                });

                return positions;
            };

            // Tested/Validated
            self.getTerminatorPositions = function() {
                var positions = [];
                _(self.dnaElements()).each(function(dna, index){
                    if(dna.DNAType === DNAType.TERMINATOR) {
                        positions.push(index);
                    }
                });

                return positions;
            };

            // Tested/Validated
            // Corresponding to step 3 in Patrick's flowchart
            self.getMRNAs = function(promPoses, termPoses) { //Extract all "mRNA's" in the gene
                var postionPairs = []; //starting and end-position in the gene for the mRNA.
                var mRNAPairs = [];

                // Extract position-piars
                while(promPoses.length > 0) {
                    var firstPromoter = promPoses.shift();

                    //1) nak alle terminals før første promoter.
                    termPoses = _.filter(termPoses, function(termPos) {
                        return termPos > firstPromoter;
                    });

                    //2) terminals.shift() !
                    var firstTerminal = termPoses.shift();

                    //3) nak alle promoters før firstTerminal
                    promPoses = _.filter(promPoses, function(promPos) {
                        return promPos > firstTerminal;
                    });

                    postionPairs.push([firstPromoter,firstTerminal]);
                }

                // Extract mRNA
                _(postionPairs).each(function(pair){
                    var promPos = pair[0];
                    var termPos = pair[1];
                    self.dnaElements()
                    var clone = _.filter(self.dnaElements(), function(dna, index){
                        return index >= promPos && index < termPos;
                    });

                    mRNAPairs.push(clone);
                });

                return mRNAPairs;
            };
        }
    });

	return Gene;
});
