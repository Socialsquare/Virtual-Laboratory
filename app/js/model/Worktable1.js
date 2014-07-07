/**
 * Backbone model that keeps state for worktable1.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
    'knockout',
	'lodash',
	'base',
	'model/Microorganism',
	'model/Container'
], function(ko, _, Base, Microorganism, Container) {
	var maxTestTubeNum = 6,
		maxPetridishNum = 3,
		maxHeaterTubes = 3;

    var Worktable1Model = Base.extend({
        id: null,
		tableItems: [],
		testTubes: [],
		bunsenBurner: ko.observable(false),
		electroporator: new Container(),
		heater: {
			content: new Array(maxHeaterTubes),
			status: false //true = on, false = off
		},

        constructor: function () {
            var self = this;

            self.addPetridish = function (content) {
		        var i = 0;
		        while(i < self.tableItems.length) {
			        if(self.tableItems[i] === null) {
				        self.tableItems[i] = content;
				        return i;
			        }
			        i++;
		        }
		        return -1;
	        };

	        self.fillPetridish = function (position, content) {
		        self.tableItems[position].addContent(content);
	        };

	        self.emptyPetridish = function (position) {
		        self.tableItems[position] = new Container({maxConcentration: 10});
	        };

	        self.hasPetridishPlaceFor = function (position, content) {
		        return self.tableItems[position].hasPlaceFor(content);
	        };

	        self.isPetridishEmpty = function (position) {
		        return self.tableItems[position].isEmpty();
	        };

	        self.removeTableItem = function (position) {
		        self.tableItems[position] = null;
	        };

	        self.getTableItem = function (position) {
		        return self.tableItems[position];
	        };

	        self.addTestTubeAtPos = function (content, position) {
		        if(self.testTubes[position] !== null) {
			        return false;
		        }
		        self.testTubes[position] = content;
		        return true;
	        };

	        self.removeTestTubeAtPos = function (position) {
		        self.testTubes[position] = null;
	        };

	        self.isTestTubeSlotEmpty = function (position) {
		        return (self.testTubes[position] === null);
	        };

	        self.hasTubePlaceFor = function (position, content) {
		        return self.testTubes[position].hasPlaceFor(content);
	        };

	        self.fillTube = function (position, content) {
		        self.testTubes[position].addContent(content);
	        };

	        self.isTubeEmpty = function (position) {
		        return self.testTubes[position].isEmpty();
	        };

	        self.getTube = function (position) {
		        return self.testTubes[position];
	        };

	        self.emptyTube = function (position) {
		        self.testTubes[position] = new Container();
	        };

	        self.toggleBunsen = function () {
		        self.bunsenBurner(!self.bunsenBurner());
	        };

	        self.hasElectroporatorPlaceFor = function (content) {
		        return self.electroporator.hasPlaceFor(content);
	        };

	        self.isElectroporatorEmpty = function () {
		        return self.electroporator.isEmpty();
	        };

	        self.fillElectroporator = function (content) {
		        self.electroporator.addContent(content);
	        };

	        self.getElectroporatorContent = function () {
		        return self.electroporator.getContent();
	        };

	        self.emptyElectroporator = function () {
		        self.electroporator = new Container();
	        };

	        self.runElectroporator = function (callback) {
		        //Check if electroporator has DNA and microorganism
		        var electroporatorContent = self.electroporator.getContent(),
			        genes = electroporatorContent.genes,
			        microorganisms = electroporatorContent.microorganisms,
			        mRNAs, subMRNAs,
			        i, j;
		        if(genes.length < 1) {
			        callback(-1, 'Der mangler DNA i electroporatoren.');
			        return;
		        }
		        if(microorganisms.length < 1) {
			        callback(-1, 'Der mangler en eller flere microorganismer i electroporatoren.');
			        return;
		        }

		        for(i = 0; i < microorganisms.length; i++) {
			        for(j = 0; j < genes.length; j++) {
				        if(!hasPromoter(genes[j])) {
					        callback(0, 'Der mangler promoter i genet.');
					        return;
				        }

				        if(!hasTerminator(genes[j])) {
					        callback(1, 'Der mangler terminator efter sidste promoter i genet.');
					        return;
				        }

				        mRNAs = getMRNAs(genes[j]);

				        subMRNAs = getSubMRNAs(mRNAs);

				        if(subMRNAs.length <= 0) {
					        callback(2, 'Der er ingen korrekt placerede proteinkodende sekvenser i genet.');
					        return;
				        }

				        if(!electroporate(microorganisms[i], genes[j], subMRNAs, callback)) {
					        return;
				        }
			        }
		        }

		        //Electroporation successfull
		        callback(5, '');
	        };

	        self.hasPromoter = function (gene) {
		        var i = 0,
			        dnaElements = gene.dnaElements;
		        while(i < dnaElements.length) {
			        if(dnaElements[i].get('type') === 0) {
				        return true;
			        }
			        i++;
		        }
		        return false;
	        };

	        /**
	         * @return true if gene has terminator after last promoter
	         */
	        self.hasTerminator = function (gene) {
		        var terminator = false,
			        dnaElements = gene.dnaElements,
			        i = dnaElements.length - 1;
		        while(i >= 0) {
			        if(dnaElements[i].get('type') === 5) {
				        terminator = true;
			        }
			        if(dnaElements[i].get('type') === 0) {
				        i = 0; //We reached last promoter, so jump out
			        }
			        i--;
		        }
		        return terminator;
	        };

	        /**
	         * @return: Array of P | RBS | SC | K | STC | T arrays
	         */
	        self.getMRNAs = function (gene) {
		        var dnaElements = gene.dnaElements,
			        mRNAs = [],
			        mRNA = [],
			        isMRNA = false,
			        i;
		        for(i = 0; i < dnaElements.length; i++) {
			        if(dnaElements[i].get('type') === 0) {
				        isMRNA = true;
			        }

			        if(isMRNA) {
				        mRNA.push(dnaElements[i]);
			        }

			        if(dnaElements[i].get('type') === 5) {
				        isMRNA = false;
				        mRNAs.push(mRNA);
				        mRNA = [];
			        }
		        }

		        return mRNAs;
	        };

	        self.getSubMRNAs = function (mRNAs) {
		        var subMRNAs = [],
			        subMRNA = [],
			        isSubMRNA, previousPromoter, i, j, dnaElem;
		        for(i = 0; i < mRNAs.length; i++) {
			        subMRNA = [];
			        isSubMRNA = false;
			        previousPromoter = null;
			        for(j = 0; j < mRNAs[i].length; j++) {
				        dnaElem = mRNAs[i][j];
				        if(isSubMRNA && dnaElem.get('type') !== 0) {
					        subMRNA.push(dnaElem);
				        }
				        if(dnaElem.get('type') === 0) {
					        if(subMRNA.length > 0) {
						        subMRNAs.push({
							        subMRNA: subMRNA,
							        promoterName: previousPromoter.get('name')
						        });
						        subMRNA = [];
						        isSubMRNA = false;
					        }
					        else {
						        isSubMRNA = true;
					        }
					        previousPromoter = dnaElem;
				        }
			        }
			        if(subMRNA.length > 0) {
				        subMRNAs.push({
					        subMRNA: subMRNA,
					        promoterName: previousPromoter.get('name')
				        });
			        }
		        }
		        return subMRNAs;
	        };

	        self.electroporate = function (microorganism, gene, subMRNAs, callback) {
		        var pcs = [], //Protein Coding Sequences
			        subMRNA, i, j;
		        for(i = 0; i < subMRNAs.length; i++) {
			        subMRNA = subMRNAs[i].subMRNA;
			        j = 0;
			        while(j < subMRNA.length && subMRNA[j].get('type') !== 1) {
				        j++;
			        }
			        if(j >= subMRNA.length) {
				        callback(3, 'Der mangler Ribosome Binding Sites i genet.');
				        return false;
			        }
			        j++;
			        if(subMRNA[j].get('type') !== 2) {
				        callback(4, 'Der mangler Start Codon efter Ribosome Binding Site.');
				        return false;
			        }
			        while(j < subMRNA.length && subMRNA[j].get('type') !== 4) {
				        if(subMRNA[j].get('type') === 3) {
					        pcs.push(subMRNA[j]);
				        }
				        j++;
			        }
			        if(j >= subMRNA.length) {
				        callback(4, 'Der mangler Stop Codon.');
				        return false;
			        }

			        //Electroporation successful
			        microorganism.addDNA(gene);
			        for(j = 0; j < pcs.length; j++) {
				        microorganism.addExtraProperty({
					        pcs: pcs[j],
					        promoterName: subMRNAs[i].promoterName
				        });
			        }
		        }
		        return true;
	        };

	        self.toggleHeater = function () {
		        var heater = self.heater;
		        heater.status = !heater.status;
	        };

	        self.addHeaterTubeAtPos = function (content, position) {
		        if(this.attributes.heater.content[position] !== null) {
			        return false;
		        }
		        this.attributes.heater.content[position] = content;
		        return true;
	        };

	        self.getHeaterTube = function (position) {
		        return this.attributes.heater.content[position];
	        };

	        self.removeHeaterTubeAtPos = function (position) {
		        this.attributes.heater.content[position] = null;
	        };
        }
    });

    return Worktable1Model;
});
