define([
    'knockout',
    'lodash',
    'utils/utils',
    'model/SimpleContainer',
    'model/OrganismProperty',
    'model/type/Container',
    'model/type/Liquid',
    'model/type/DNA'
], function (ko, _, utils, SimpleContainerModel, OrganismPropertyModel, ContainerType, LiquidType, DNAType) {

    var Electroporator = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.ELECTROPORATOR, Math.pow(10, 13));

            self.status = ko.observable(false);

            self.activate = function () {
                /*1) For hver liquid som er et "Gene"
                 1.1) Overfør Gene til hver microorganisme - TJEK
                 1.2) Kontrollér om det er korrekt designet
                 1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/
                self.status(true);

                _.delay(self.status, 1000, false);

                _(self.liquids()).each(function(gene){
                    if(gene.type() === LiquidType.GENE) {
                        // 1.1) Overfør Gene til hver microorganisme
                        self.transferGeneToAllOrganisms(gene);

                        // 1.2) Kontrollér om det er korrekt designet //TODO: Resten skal laves efter Patrick's flowchart.
                        var values = self.verifyGeneAndGetProperties(gene);
                        var newProperties = values.newProperties;

                        //1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/
                        _(self.liquids()).each(function(organism) {
                            if(organism.type() === LiquidType.MICROORGANISM) {
                                organism.extraProperties.pushAll(newProperties);
                                console.log('Modified organism.');
                            }
                        });
                    }
                });

            };

            self.getQuizVideo = function () {
                //TODO: implement
                // Finds the lowest number of video-quizzes to show - corresponding to the worst designed gene
                var lowestNumber = Infinity;


                _(self.liquids()).each(function(gene){
                    if(gene.type() === LiquidType.GENE) {
                        // 1.1) Overfør Gene til hver microorganisme
                        self.transferGeneToAllOrganisms(gene);

                        // 1.2) Kontrollér om det er korrekt designet //TODO: Resten skal laves efter Patrick's flowchart.
                        var values = self.verifyGeneAndGetProperties(gene);

                        lowestNumber = values.firstError < lowestNumber ? values.firstError : lowestNumber;
                    }
                });

                if (lowestNumber > 7)
                    lowestNumber = 7;

                return lowestNumber;
            };

            //Verifies the gene and returns new properties.
            //TODO: implement the rest of Patrick's flowchart. Currently only does the steps 1-3.
            // TODO: fire videos & quizzes
            self.verifyGeneAndGetProperties = function(gene) { //1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/

                var returnObject = {firstError: Infinity, newProperties: []};
                var firstError = -1; // firstError is for deciding which QuizVideo to show.
                var newProperties = []; // newProperties are the OrganismProperties to add to the organisms

                // Er der 1 eller flere promotere i genet?
                var MRNAs = [];
                var promoterPositions = gene.getPromoterPositions();
                var promLen = promoterPositions.length;
                if(promLen <= 0) {
                    // Quiz #1 , missing promoter
                    console.log('TODO: fire video + quizzes #1');
                    returnObject.firstError = 1;

                    return returnObject;
                } //TODO: -

                // Er der en terminator efter den sidste promoter?
                var terminatorPositions = gene.getTerminatorPositions();
                var termLen = terminatorPositions.length;
                if(termLen <= 0) {
                    console.log('TODO: fire video + quizzes #2.1');
                    returnObject.firstError = 2;
                    return returnObject;
                } //TODO: .
                else if(! (terminatorPositions[termLen-1] > promoterPositions[promLen-1]))  {
                    console.log('TODO: fire video + quizzes #2.2');
                    returnObject.firstError = 2;
                    return returnObject;
                } //TODO: .

                MRNAs = gene.getMRNAs(promoterPositions, terminatorPositions);

                //TODO: this is a temporary shortcut to get OrganismProperties into play. Do the rest of the flowchart!

                _(MRNAs).each(function(mRNA){
                    var promoter = mRNA.shift();

                    _(mRNA).each(function(DNAelement){
                        console.log('DNAtype:' + DNAelement.DNAType());

                        if(DNAelement.DNAType() === DNAType.PROTEINKODENDE_SEKVENS) {

                            var promoter_clone = promoter.clone();
                            var dna_clone = DNAelement.clone();

                            newProperties.push(new OrganismPropertyModel(promoter_clone, dna_clone));
                        }
                    });
                });

                return newProperties;
            };

            self.transferGeneToAllOrganisms = function (gene) {
                _.each(self.liquids(), function(microorganism) {
                    if(microorganism.type() === LiquidType.MICROORGANISM) {
                        /*debugger;*/
                        var cloned = gene.clone();
                        microorganism.addGene(cloned);
                    }
                });
            };

        }
    });

    return Electroporator;
});
