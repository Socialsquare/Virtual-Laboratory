/**
 * Backbone model that keeps state for worktable2.
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
		maxCentrifugeTubeNum = 4;

	var model = Backbone.Model.extend({
		defaults: {
			id: null,
			tableItems: new Array(maxPetridishNum),
			testTubes: new Array(maxTestTubeNum),
			centrifugeTubes: new Array(maxCentrifugeTubeNum),
			blender: {
				dirty: false,
				content: null
			},
			OD: null
		},
		initialize: function(option) {
			var tableItems = this.attributes.tableItems,
				testTubes = this.attributes.testTubes,
				centrifugeTubes = this.attributes.centrifugeTubes,
				i;
			for(i = 0; i < tableItems.length; i++) {
				tableItems[i] = null;
			}
			for(i = 0; i < testTubes.length; i++) {
				testTubes[i] = null;
			}
			for(i = 0; i < centrifugeTubes.length; i++) {
				centrifugeTubes[i] = null;
			}
		},

		addPetridish: addPetridish,
		fillPetridish: fillPetridish,
		hasPetridishPlaceFor: hasPetridishPlaceFor,
		emptyPetridish: emptyPetridish,
		isPetridishEmpty: isPetridishEmpty,
		getTableItem: getTableItem,
		removeTableItem: removeTableItem,
		addTestTubeAtPos: addTestTubeAtPos,
		isTestTubeSlotEmpty: isTestTubeSlotEmpty,
		fillTube: fillTube,
		isTubeEmpty: isTubeEmpty,
		hasTubePlaceFor: hasTubePlaceFor,
		emptyTube: emptyTube,
		getTube: getTube,
		removeTestTubeAtPos: removeTestTubeAtPos,
		addTubeToCentrifuge: addTubeToCentrifuge,
		getTubeFromCentrifuge: getTubeFromCentrifuge,
		removeTubeFromCentrifuge: removeTubeFromCentrifuge,
		getCentrifugeTubeCount: getCentrifugeTubeCount,
		isODEmpty: isODEmpty,
		addTubeToOD: addTubeToOD,
		getTubeFromOD: getTubeFromOD,
		emptyOD: emptyOD,
		isBlenderDirty: isBlenderDirty
	});
	
	return model;

	function addPetridish(content) {
		var tableItems = this.attributes.tableItems,
			i = 0;
		while(i < tableItems.length) {
			if(tableItems[i] === null) {
				tableItems[i] = content;
				return i;
			}
			i++;
		}
		return -1;
	}

	function fillPetridish(position, content) {
		this.attributes.tableItems[position].addContent(content);
	}

	function hasPetridishPlaceFor(position, content) {
		return this.attributes.tableItems[position].hasPlaceFor(content);
	}

	function emptyPetridish(position) {
		this.attributes.tableItems[position] = new Container({maxConcentration: 10});
	}

	function isPetridishEmpty(position) {
		return this.attributes.tableItems[position].isEmpty();
	}

	function getTableItem(position) {
		return this.attributes.tableItems[position];
	}

	function removeTableItem(position) {
		this.attributes.tableItems[position] = null;
	}

	function addTestTubeAtPos(content, position) {
		if(this.attributes.testTubes[position] !== null) {
			return false;
		}
		this.attributes.testTubes[position] = content;
		return true;
	}

	function isTestTubeSlotEmpty(position) {
		return (this.attributes.testTubes[position] === null);
	}

	function fillTube(position, content) {
		this.attributes.testTubes[position].addContent(content);
	}

	function isTubeEmpty(position) {
		return this.attributes.testTubes[position].isEmpty();
	}

	function hasTubePlaceFor(position, content) {
		return this.attributes.testTubes[position].hasPlaceFor(content);
	}

	function emptyTube(position) {
		this.attributes.testTubes[position] = new Container();
	}

	function getTube(position) {
		return this.attributes.testTubes[position];
	}

	function removeTestTubeAtPos(position) {
		this.attributes.testTubes[position] = null;
	}

	function addTubeToCentrifuge(content) {
		var centrifugeTubes = this.attributes.centrifugeTubes,
			i = 0;
		while(i < centrifugeTubes.length) {
			if(centrifugeTubes[i] === null) {
				centrifugeTubes[i] = content;
				return i + 1;
			}
			i++;
		}
		return 0;
	}

	/**
	 * @return tube or null.
	 */
	function getTubeFromCentrifuge() {
		var centrifugeTubes = this.attributes.centrifugeTubes,
			i = centrifugeTubes.length - 1;
		while(i >= 0) {
			if(centrifugeTubes[i] !== null) {
				return centrifugeTubes[i];
			}
			i--;
		}
		return null;
	}

	function removeTubeFromCentrifuge() {
		var centrifugeTubes = this.attributes.centrifugeTubes,
			i = centrifugeTubes.length - 1;
		while(i >= 0) {
			if(centrifugeTubes[i] !== null) {
				centrifugeTubes[i] = null;
				return;
			}
			i--;
		}
		return null;
	}

	function getCentrifugeTubeCount() {
		var centrifugeTubes = this.attributes.centrifugeTubes,
			i = centrifugeTubes.length - 1;
		while(i >= 0 && centrifugeTubes[i] === null) {
			i--;
		}
		return i + 1;
	}

	function isODEmpty() {
		return (this.attributes.OD === null);
	}

	function addTubeToOD(content) {
		this.attributes.OD = content;
	}

	function getTubeFromOD() {
		return this.attributes.OD;
	}

	function emptyOD() {
		this.attributes.OD = null;
	}

	function isBlenderDirty() {
		return this.attributes.blender.dirty;
	}
});
