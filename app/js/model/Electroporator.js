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
                // firstError is for deciding which QuizVideo to show.
                // newProperties are the OrganismProperties to add to the organisms

                // Er der 1 eller flere promotere i genet?
                var MRNAs = [];
                var promoterPositions = gene.getPromoterPositions();
                var promLen = promoterPositions.length;
                if(promLen <= 0) {
                    // Quiz #1 , missing promoter
                    returnObject.firstError = 1;

                    return returnObject;
                }

                // Er der en terminator efter den sidste promoter?
                var terminatorPositions = gene.getTerminatorPositions();
                var termLen = terminatorPositions.length;
                if(termLen <= 0) {
                    returnObject.firstError = 2;
                    return returnObject;
                }
                else if(! (terminatorPositions[termLen-1] > promoterPositions[promLen-1]))  {
                    returnObject.firstError = 2;
                    return returnObject;
                }

                MRNAs = gene.getMRNAs(promoterPositions, terminatorPositions);



                _(MRNAs).each(function(mRNA){
                    //TODO: implement her.
                    var values = self.examineMRNAandGetNewProperties(mRNA); //TODO: set quiz/video-numbers

                    returnObject.firstError = values.firstError < returnObject.firstError ?
                        values.firstError : returnObject.firstError;

                    _.each(values.newProperties, function(newProperty) {
                        returnObject.newProperties.push(newProperty);
                    });
                    //TODO: values.newProperties




                });

                return returnObject;
            };

            self.transferGeneToAllOrganisms = function (gene) {
                _.each(self.liquids(), function(microorganism) {
                    if(microorganism.type() === LiquidType.MICROORGANISM) {

                        var cloned = gene.clone();
                        microorganism.addGene(cloned);
                    }
                });
            };

            self.examineMRNAandGetNewProperties = function(mRNA) {

                var values = {firstError: Infinity, newProperties: []};
                var subMRNAs = [];

                var promoterPositions = [];
                _.each(mRNA,function(dna, index){
                    if(dna.DNAType() === DNAType.PROMOTER) {
                        promoterPositions.push(index);
                    }
                });

                //TODO: tjek om mRNA starter med promoter - gør det.
// Extract sub-mRNAs
                _.each(promoterPositions, function(promoterPosition, index) {
                    var subMRNA = {promoter: {}, DNAs: []};

                    subMRNA.DNAs = mRNA.slice(promoterPosition + 1, promoterPositions[index + 1]); //Apparently, .slice() even works with undefined. Awesome.
                    subMRNA.promoter = mRNA[promoterPosition];
                    subMRNAs.push(subMRNA);
                });


                subMRNAs =_.filter(subMRNAs, function(subMRNA) {
                    var containsPCS = _.any(subMRNA.DNAs, function(dna) {
                        return dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS
                    });

                    if (!containsPCS) {


                        var containsRBS =_.any(subMRNA.DNAs, function(dna) {
                           return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                        });

                        if (!containsRBS) {
                            // Quiz #3 (no RBS)
                            values.firstError = 3 < values.firstError ? 3 : values.firstError;
                        }else{

                            var firstRBSIndex = _.findIndex(subMRNA.DNAs, function(dna){
                                return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                            });

                            var dnasAfterRBS = subMRNA.DNAs.slice(firstRBSIndex);
                            var containsStartCodon = _.any(dnasAfterRBS, function(dna) {
                                return dna.DNAType() === DNAType.START_CODON;
                            });

                            if (! containsStartCodon) {
                                // Quiz #4 (no start codon)
                                values.firstError = 4 < values.firstError ? 4 : values.firstError;
                                console.log('Electro #1');
                            }else {
                                // Quiz # 5 (no PCS)
                                values.firstError = 5 < values.firstError ? 5 : values.firstError;
                                console.log('Electro #2');
                            }
                        }
                    }

                    return containsPCS;
                });


// FLow, page 2
                subMRNAs =_.filter(subMRNAs, function(subMRNA) {
                    var containsRBSBeforeLastPCS = false;
                    var lastPCSIndex = 0;
                    _.each(subMRNA.DNAs, function(dna,index) {
                        if (dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS) {
                            lastPCSIndex = index > lastPCSIndex ? index : lastPCSIndex;

                        }
                    });

                    containsRBSBeforeLastPCS = _.any(subMRNA.DNAs, function(dna, index){
                        return (dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE
                            && index < lastPCSIndex);
                    });

                    if (!containsRBSBeforeLastPCS) {
                        var containsRBS = _.any(subMRNA.DNAs, function(dna) {
                            return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                        });

                        //(1) - does it contain RBS at all?
                        if(!containsRBS) {
                            // Quiz #3 (no RBS)
                            values.firstError = 3 < values.firstError ? 3 : values.firstError;
                            console.log('Electro #3');
                        }else{
                            var firstRBSIndex = _.findIndex(subMRNA.DNAs, function(dna){
                                return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                            });
                            var dnasAfterRBS = subMRNA.DNAs.slice(firstRBSIndex);
                            var containsStartCodon = _.any(dnasAfterRBS, function(dna) {
                                return dna.DNAType() === DNAType.START_CODON;
                            });

                            //(2) - is there a Start Codon after the RBS?
                            if (! containsStartCodon) {
                                // Quiz #4 (no start codon)
                                values.firstError = 4 < values.firstError ? 4 : values.firstError;
                                console.log('Electro #4');
                            }else {//(3) - otherwise PCS is missing
                                // Quiz # 5 (no PCS)
                                values.firstError = 5 < values.firstError ? 5 : values.firstError;
                                console.log('Electro #5');
                            }


                        }



                    }


                    return containsRBSBeforeLastPCS;
                });

//Se bort fra alt før det første RBS   -- kl. 21:53
                _.each(subMRNAs, function(subMRNA) {
                    var firstRBSIndex = _.findIndex(subMRNA.DNAs, function(dna){
                        return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                    });

                    subMRNA.DNAs = _.filter(subMRNA.DNAs, function(dna, index) {
                        return index >= firstRBSIndex;
                    });
                });

// Er der i hvert sub-mRNA, efter første RBS, mindst et Start Codon (Start)?
                subMRNAs = _.filter(subMRNAs, function(subMRNA) {
                    var containsStartCodon = _.any(subMRNA.DNAs, function(dna) {
                        return dna.DNAType() === DNAType.START_CODON;
                    });

                    if (!containsStartCodon) {
                        // Quiz #4 (no start codon)
                        values.firstError = 4 < values.firstError ? 4 : values.firstError;
                        console.log('Electro #6');
                    }

                    return containsStartCodon;
                });

// Se bort fra alt DNA før det første Start Codon i de følgende kontroller, samt ignorér RBS.
                _.each(subMRNAs, function(subMRNA) {
                    var firstStartCodonIndex = _.findIndex(subMRNA.DNAs, function(dna){
                        return dna.DNAType() === DNAType.START_CODON;
                    });

                    subMRNA.DNAs = _.filter(subMRNA.DNAs, function(dna, index) {
                        return index >= firstStartCodonIndex;
                    });
                });

// Er der i hvert sub-mRNA, efter første Start Codon et Proteinkodende Sekvens
                subMRNAs = _.filter(subMRNAs, function(subMRNA) {
                    var containsPCS = _.any(subMRNA.DNAs, function(dna) {
                        return dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS;
                    });

                    if(!containsPCS) {
                        // Quiz # 5 (no PCS)
                        values.firstError = 5 < values.firstError ? 5 : values.firstError;
                        console.log('Electro #7');
                    }

                    return containsPCS;
                });

// Er det sidste i sub-mRNA’et et Stop Codon (Stop)?
                subMRNAs = _.filter(subMRNAs, function(subMRNA) {
                    var containsStopCodon = _.any(subMRNA.DNAs, function(dna) {
                        return dna.DNAType() === DNAType.STOP_CODON;
                    });

                    if(!containsStopCodon) {
                        // Quiz # 6 (no stop codon)
                        values.firstError = 6 < values.firstError ? 6 : values.firstError;
                        console.log('Electro #8');
                    }

                    return containsStopCodon;
                });


                    console.log('subMRNAs.length: ' + subMRNAs.length);

                _.each(subMRNAs, function(subMRNA) {
                    //TODO: last two parts of the DNA-flow! (extract the new properties)

                    //Get start codon positions
                    var startPositions = [];
                    _.each(subMRNA.DNAs, function(dna, index){
                        if(dna.DNAType() === DNAType.START_CODON) {
                            startPositions.push(index);
                        }
                    });

                    //Get stop codon positions
                    var stopPositions = [];
                    _.each(subMRNA.DNAs, function(dna, index){
                        if(dna.DNAType() === DNAType.STOP_CODON) {
                            stopPositions.push(index);
                        }
                    });


                    var postionPairs = []; //starting and end-position in the gene for the mRNA.
                    var viableDNAlists = []; //NESTED LISTS! DNAs containing allowed PCSs

                    // Extract position-piars
                    while(startPositions.length > 0) {
                        var firstStartCodon = startPositions.shift();

                        //1) nak alle terminals før første promoter.
                        stopPositions = _.filter(stopPositions, function(stopPosition) {
                            return stopPosition > firstStartCodon;
                        });

                        //2) terminals.shift() !
                        var firstStop = stopPositions.shift();

                        //3) nak alle promoters før firstStop
                        startPositions = _.filter(startPositions, function(startPosition) {
                            return startPosition > firstStop;
                        });

                        postionPairs.push([firstStartCodon,firstStop]);
                    }

                    // Extract relevant DNA
                    _(postionPairs).each(function(pair){
                        var startPos = pair[0];
                        var stopPos = pair[1];

                        var clonedDNAs = _.filter(subMRNA.DNAs, function(dna, index){
                            return index >= startPos && index < stopPos;
                        });

                        viableDNAlists.push(clonedDNAs);
                    });

                    _.each(viableDNAlists, function(viableDNAlist) {
                        _.each(viableDNAlist, function(dna) {
                            if (dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS) {
                                values.newProperties.push(
                                    new OrganismPropertyModel(subMRNA.promoter.clone(), dna.clone()));

                            }
                        });
                    });

                });


                return values;
            };

        }
    });

    return Electroporator;
});
