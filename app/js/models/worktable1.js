/**
 * Backbone model that keeps state for worktable1.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'models/microorganism',
	'models/container'],
function(_, Backbone, Microorganism, Container) {
	var maxTestTubeNum = 6,
		maxPetridishNum = 3,
		maxHeaterTubes = 3;


	var model = Backbone.Model.extend({
		/**
		 * Container contents: {
		 *		dna: [],
		 *		microorganisms: []
		 *	}
		 */
		defaults: {
			id: null,
			tableItems: new Array(maxPetridishNum),
			testTubes: new Array(maxTestTubeNum),
			bunsenBurner: false, //false = off, true = on
			electroporator: new Container(),
			heater: {
				content: new Array(maxHeaterTubes),
				status: false //true = on, false = off
			}
		},
		initialize: function(option) {
			var i;
			for(i = 0; i < this.attributes.tableItems.length; i++) {
				this.attributes.tableItems[i] = null;
			}
			for(i = 0; i < this.attributes.testTubes.length; i++) {
				this.attributes.testTubes[i] = null;
			}
			for(i = 0; i < this.attributes.heater.content.length; i++) {
				this.attributes.heater.content[i] = null;
			}
		},
		addPetridish: addPetridish,
		fillPetridish: fillPetridish,
		emptyPetridish: emptyPetridish,
		hasPetridishPlaceFor: hasPetridishPlaceFor,
		isPetridishEmpty: isPetridishEmpty,
		removeTableItem: removeTableItem,
		getTableItem: getTableItem,
		addTestTubeAtPos: addTestTubeAtPos,
		isTestTubeSlotEmpty: isTestTubeSlotEmpty,
		removeTestTubeAtPos: removeTestTubeAtPos,
		hasTubePlaceFor: hasTubePlaceFor,
		fillTube: fillTube,
		isTubeEmpty: isTubeEmpty,
		getTube: getTube,
		emptyTube: emptyTube,
		hasElectroporatorPlaceFor: hasElectroporatorPlaceFor,
		isElectroporatorEmpty: isElectroporatorEmpty,
		getElectroporatorContent: getElectroporatorContent,
		emptyElectroporator: emptyElectroporator,
		fillElectroporator: fillElectroporator,
		runElectroporator: runElectroporator,
		toggleBunsen: toggleBunsen,
		toggleHeater: toggleHeater,
		addHeaterTubeAtPos: addHeaterTubeAtPos,
		getHeaterTube: getHeaterTube,
		removeHeaterTubeAtPos: removeHeaterTubeAtPos
	});
	
	return model;

	function addPetridish(content) {
		var i = 0;
		while(i < this.attributes.tableItems.length) {
			if(this.attributes.tableItems[i] === null) {
				this.attributes.tableItems[i] = content;
				return i;
			}
			i++;
		}
		return -1;
	}

	function fillPetridish(position, content) {
		this.attributes.tableItems[position].addContent(content);
	}

	function emptyPetridish(position) {
		this.attributes.tableItems[position] = new Container({maxConcentration: 10});
	}

	function hasPetridishPlaceFor(position, content) {
		return this.attributes.tableItems[position].hasPlaceFor(content);
	}

	function isPetridishEmpty(position) {
		return this.attributes.tableItems[position].isEmpty();
	}

	function removeTableItem(position) {
		this.attributes.tableItems[position] = null;
	}

	function getTableItem(position) {
		return this.attributes.tableItems[position];
	}

	function addTestTubeAtPos(content, position) {
		if(this.attributes.testTubes[position] !== null) {
			return false;
		}
		this.attributes.testTubes[position] = content;
		return true;
	}

	function removeTestTubeAtPos(position) {
		this.attributes.testTubes[position] = null;
	}

	function isTestTubeSlotEmpty(position) {
		return (this.attributes.testTubes[position] === null);
	}

	function hasTubePlaceFor(position, content) {
		return this.attributes.testTubes[position].hasPlaceFor(content);
	}

	function fillTube(position, content) {
		this.attributes.testTubes[position].addContent(content);
	}

	function isTubeEmpty(position) {
		return this.attributes.testTubes[position].isEmpty();
	}

	function getTube(position) {
		return this.attributes.testTubes[position];
	}

	function emptyTube(position) {
		this.attributes.testTubes[position] = new Container();
	}

	function toggleBunsen() {
		this.attributes.bunsenBurner = !this.attributes.bunsenBurner;
	}

	function hasElectroporatorPlaceFor(content) {
		return this.attributes.electroporator.hasPlaceFor(content);
	}

	function isElectroporatorEmpty() {
		return this.attributes.electroporator.isEmpty();
	}

	function fillElectroporator(content) {
		this.attributes.electroporator.addContent(content);
	}

	function getElectroporatorContent() {
		return this.attributes.electroporator.getContent();
	}

	function emptyElectroporator() {
		this.attributes.electroporator = new Container();
	}

	function runElectroporator(callback) {
		//Check if electroporator has DNA and microorganism
		var electroporatorContent = this.attributes.electroporator.getContent(),
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
	}

	function hasPromoter(gene) {
		var i = 0,
			dnaElements = gene.dnaElements;
		while(i < dnaElements.length) {
			if(dnaElements[i].get('type') === 0) {
				return true;
			}
			i++;
		}
		return false;
	}

	/**
	 * @return true if gene has terminator after last promoter
	 */
	function hasTerminator(gene) {
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
	}

	/**
	 * @return: Array of P | RBS | SC | K | STC | T arrays
	 */
	function getMRNAs(gene) {
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
	}

	function getSubMRNAs(mRNAs) {
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
	}

	function electroporate(microorganism, gene, subMRNAs, callback) {
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
	}

	function toggleHeater() {
		var heater = this.attributes.heater;
		heater.status = !heater.status;
	}

	function addHeaterTubeAtPos(content, position) {
		if(this.attributes.heater.content[position] !== null) {
			return false;
		}
		this.attributes.heater.content[position] = content;
		return true;
	}

	function getHeaterTube(position) {
		return this.attributes.heater.content[position];
	}

	function removeHeaterTubeAtPos(position) {
		this.attributes.heater.content[position] = null;
	}
});
