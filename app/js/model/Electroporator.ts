import ko = require('knockout');
import _ = require('lodash');

import LiquidHelper = require('utils/LiquidHelper');

import SimpleContainerModel = require('model/SimpleContainer');
import OrganismPropertyModel = require('model/OrganismProperty');
import DNAElementModel = require('model/DNAElement');
import GeneModel = require('model/Gene');

import ContainerType = require('model/type/Container');
import DNAType = require('model/type/DNA');

// Helper types
type DNAList = DNAElementModel[];
type SubMRNA = {
    promoter: DNAElementModel;
    DNAs: DNAList;
}

class Electroporator extends SimpleContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(ContainerType.ELECTROPORATOR, Math.pow(10, 13));

        this.status = ko.observable(false);

        ko.rebind(this);
    }

    activate() {
        /*1) For hver liquid som er et "Gene"
          1.1) Overfør Gene til hver microorganisme - TJEK
          1.2) Kontrollér om det er korrekt designet
          1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/
        this.status(true);

        _.delay(this.status, 1000, false);

        _.each(LiquidHelper.genes(this.liquids()), (gene) => {
            // 1.1) Overfør Gene til hver microorganisme
            this.transferGeneToAllOrganisms(gene);

            // 1.2) Kontrollér om det er korrekt designet //TODO: Resten skal laves efter Patrick's flowchart.
            var values = this.verifyGeneAndGetProperties(gene);
            var newProperties = values.newProperties;

            //1.2.1) Hvis det er korrekt designet, overfør hver egenskab til hver mirkoorganisme*/

            _.each(LiquidHelper.mos(this.liquids()), (organism) => {
                organism.extraProperties.pushAll(newProperties);
                console.log('Modified organism.');
            });
        });

    }

    getQuizVideo() {
        // Finds the lowest number of video-quizzes to show - corresponding to the worst designed gene
        var lowestNumber = Infinity;

        _.each(LiquidHelper.genes(this.liquids()), (gene) => {
            // 1.1) Overfør Gene til hver microorganisme
            this.transferGeneToAllOrganisms(gene);

            // 1.2) Kontrollér om det er korrekt designet //TODO: Resten skal laves efter Patrick's flowchart.
            var values = this.verifyGeneAndGetProperties(gene);

            lowestNumber = values.firstError < lowestNumber ? values.firstError : lowestNumber;
        });

        if (lowestNumber > 7)
            lowestNumber = 7;

        return lowestNumber;
    }

    //Verifies the gene and returns new properties.
    verifyGeneAndGetProperties(gene) {
        //1.2.1) Hvis det er korrekt designet, overfør hver egenskab
        //til hver mirkoorganisme*/

        var returnObject = {firstError: Infinity, newProperties: []};
        // firstError is for deciding which QuizVideo to show.
        // newProperties are the OrganismProperties to add to the organisms

        // Er der 1 eller flere promotere i genet?
        var promoterPositions = gene.getPromoterPositions();
        var promLen = promoterPositions.length;
        if (promLen <= 0) {
            // Quiz #1 , missing promoter
            returnObject.firstError = 1;

            return returnObject;
        }

        // Er der en terminator efter den sidste promoter?
        var terminatorPositions = gene.getTerminatorPositions();
        var termLen = terminatorPositions.length;
        if (termLen <= 0) {
            returnObject.firstError = 2;
            return returnObject;
        }
        else if (!(terminatorPositions[termLen - 1] > promoterPositions[promLen - 1]))  {
            returnObject.firstError = 2;
            return returnObject;
        }

        var MRNAs: DNAList[] = gene.getMRNAs(promoterPositions, terminatorPositions);

        _(MRNAs).each((mRNA) => {
            // TODO: set quiz/video-numbers
            var values = this.examineMRNAandGetNewProperties(mRNA);

            returnObject.firstError = values.firstError < returnObject.firstError ?
                values.firstError : returnObject.firstError;

            _.each(values.newProperties, (newProperty) => {
                returnObject.newProperties.push(newProperty);
            });

        });

        return returnObject;
    }

    transferGeneToAllOrganisms(gene: GeneModel) {
        _.each(LiquidHelper.mos(this.liquids()), (microorganism) => {
            var cloned = gene.clone();
            microorganism.addGene(cloned);
        });
    }

    examineMRNAandGetNewProperties(mRNA: DNAList) {

        var values = { firstError: Infinity, newProperties: [] };
        var subMRNAs: SubMRNA[] = [];

        var promoterPositions: number[] = [];
        _.each(mRNA, (dna, index) => {
            if (dna.DNAType() === DNAType.PROMOTER) {
                promoterPositions.push(index);
            }
        });

        // Extract sub-mRNAs
        _.each(promoterPositions, (promoterPosition, index) => {
            var subMRNA: SubMRNA = { promoter: <DNAElementModel>{}, DNAs: <DNAList>[] };

            //Apparently, .slice() even works with undefined. Awesome.
            subMRNA.DNAs = mRNA.slice(promoterPosition + 1, promoterPositions[index + 1]);
            subMRNA.promoter = mRNA[promoterPosition];
            subMRNAs.push(subMRNA);
        });


        subMRNAs = _.filter(subMRNAs, (subMRNA) => {
            var containsPCS = _.any(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS;
            });

            if (!containsPCS) {
                var containsRBS = _.any(subMRNA.DNAs, (dna) => {
                    return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                });

                if (!containsRBS) {
                    // Quiz #3 (no RBS)
                    values.firstError = 3 < values.firstError ? 3 : values.firstError;
                } else {

                    var firstRBSIndex = _.findIndex(subMRNA.DNAs, (dna) => {
                        return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                    });

                    var dnasAfterRBS = subMRNA.DNAs.slice(firstRBSIndex);
                    var containsStartCodon = _.any(dnasAfterRBS, (dna) => {
                        return dna.DNAType() === DNAType.START_CODON;
                    });

                    if (! containsStartCodon) {
                        // Quiz #4 (no start codon)
                        values.firstError = 4 < values.firstError ? 4 : values.firstError;
                        console.log('Electro #1');
                    } else {
                        // Quiz # 5 (no PCS)
                        values.firstError = 5 < values.firstError ? 5 : values.firstError;
                        console.log('Electro #2');
                    }
                }
            }

            return containsPCS;
        });


        // FLow, page 2
        subMRNAs = _.filter(subMRNAs, (subMRNA) => {
            var containsRBSBeforeLastPCS = false;
            var lastPCSIndex = 0;
            _.each(subMRNA.DNAs, (dna, index) => {
                if (dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS) {
                    lastPCSIndex = index > lastPCSIndex ? index : lastPCSIndex;
                }
            });

            containsRBSBeforeLastPCS = _.any(subMRNA.DNAs, (dna, index) => {
                return (dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE
                        && index < lastPCSIndex);
            });

            if (!containsRBSBeforeLastPCS) {
                var containsRBS = _.any(subMRNA.DNAs, (dna) => {
                    return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                });

                //(1) - does it contain RBS at all?
                if (!containsRBS) {
                    // Quiz #3 (no RBS)
                    values.firstError = 3 < values.firstError ? 3 : values.firstError;
                    console.log('Electro #3');
                } else {
                    var firstRBSIndex = _.findIndex(subMRNA.DNAs, (dna) => {
                        return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
                    });
                    var dnasAfterRBS = subMRNA.DNAs.slice(firstRBSIndex);
                    var containsStartCodon = _.any(dnasAfterRBS, (dna) => {
                        return dna.DNAType() === DNAType.START_CODON;
                    });

                    //(2) - is there a Start Codon after the RBS?
                    if (!containsStartCodon) {
                        // Quiz #4 (no start codon)
                        values.firstError = 4 < values.firstError ? 4 : values.firstError;
                        console.log('Electro #4');
                    } else {//(3) - otherwise PCS is missing
                        // Quiz # 5 (no PCS)
                        values.firstError = 5 < values.firstError ? 5 : values.firstError;
                        console.log('Electro #5');
                    }
                }
            }

            return containsRBSBeforeLastPCS;
        });

        //Se bort fra alt før det første RBS   -- kl. 21:53
        _.each(subMRNAs, (subMRNA) => {
            var firstRBSIndex = _.findIndex(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.RIBOSOME_BINDING_SITE;
            });

            subMRNA.DNAs = _.filter(subMRNA.DNAs, (dna, index) => {
                return index >= firstRBSIndex;
            });
        });

        // Er der i hvert sub-mRNA, efter første RBS, mindst et Start
        // Codon (Start)?
        subMRNAs = _.filter(subMRNAs, (subMRNA) => {
            var containsStartCodon = _.any(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.START_CODON;
            });

            if (!containsStartCodon) {
                // Quiz #4 (no start codon)
                values.firstError = 4 < values.firstError ? 4 : values.firstError;
                console.log('Electro #6');
            }

            return containsStartCodon;
        });

        // Se bort fra alt DNA før det første Start Codon i de
        // følgende kontroller, samt ignorér RBS.
        _.each(subMRNAs, (subMRNA) => {
            var firstStartCodonIndex = _.findIndex(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.START_CODON;
            });

            subMRNA.DNAs = _.filter(subMRNA.DNAs, (dna, index) => {
                return index >= firstStartCodonIndex;
            });
        });

        // Er der i hvert sub-mRNA, efter første Start Codon et
        // Proteinkodende Sekvens
        subMRNAs = _.filter(subMRNAs, (subMRNA) => {
            var containsPCS = _.any(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS;
            });

            if (!containsPCS) {
                // Quiz # 5 (no PCS)
                values.firstError = 5 < values.firstError ? 5 : values.firstError;
                console.log('Electro #7');
            }

            return containsPCS;
        });

        // Er det sidste i sub-mRNA’et et Stop Codon (Stop)?
        subMRNAs = _.filter(subMRNAs, (subMRNA) => {
            var containsStopCodon = _.any(subMRNA.DNAs, (dna) => {
                return dna.DNAType() === DNAType.STOP_CODON;
            });

            if (!containsStopCodon) {
                // Quiz # 6 (no stop codon)
                values.firstError = 6 < values.firstError ? 6 : values.firstError;
            }

            return containsStopCodon;
        });


        _.each(subMRNAs, (subMRNA) => {

            //Get start codon positions
            var startPositions = [];
            _.each(subMRNA.DNAs, (dna, index) => {
                if (dna.DNAType() === DNAType.START_CODON) {
                    startPositions.push(index);
                }
            });

            //Get stop codon positions
            var stopPositions = [];
            _.each(subMRNA.DNAs, (dna, index) => {
                if (dna.DNAType() === DNAType.STOP_CODON) {
                    stopPositions.push(index);
                }
            });

            // Starting and end-position in the gene for the mRNA.
            var postionPairs: number[][] = [];
            // NESTED LISTS! DNAs containing allowed PCSs
            var viableDNAlists: DNAList[] = [];

            // Extract position-piars
            while (startPositions.length > 0) {
                var firstStartCodon = startPositions.shift();

                //1) nak alle terminals før første promoter.
                stopPositions = _.filter(stopPositions, (stopPosition) => {
                    return stopPosition > firstStartCodon;
                });

                //2) terminals.shift() !
                var firstStop = stopPositions.shift();

                //3) nak alle promoters før firstStop
                startPositions = _.filter(startPositions, (startPosition) => {
                    return startPosition > firstStop;
                });

                postionPairs.push([firstStartCodon, firstStop]);
            }

            // Extract relevant DNA
            _(postionPairs).each((pair) => {
                var startPos = pair[0];
                var stopPos = pair[1];

                var clonedDNAs = _.filter(subMRNA.DNAs, (dna, index) => {
                    return index >= startPos && index < stopPos;
                });

                viableDNAlists.push(clonedDNAs);
            });

            _.each(viableDNAlists, (viableDNAlist) => {
                _.each(viableDNAlist, (dna) => {
                    if (dna.DNAType() === DNAType.PROTEINKODENDE_SEKVENS) {
                        values.newProperties.push(
                            new OrganismPropertyModel(subMRNA.promoter.clone(), dna.clone()));

                    }
                });
            });

        });

        return values;
    }
}

export = Electroporator;
