/**
 * Backbone model that keeps state for worktable2.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
	'knockout',
	'lodash',
    'base',
	'model/Microorganism',
	'model/Container'],
function(ko, _, Base, Microorganism, Container) {
	var maxTestTubeNum = 6,
		maxPetridishNum = 3,
		maxCentrifugeTubeNum = 4;

    var Worktable2Model = Base.extend({
        id: null,
		tableItems: new Array(maxPetridishNum),
		testTubes: new Array(maxTestTubeNum),
		centrifugeTubes: new Array(maxCentrifugeTubeNum),
		blender: {
			dirty: false,
			content: null
		},
		OD: null,

        constructor: function () {
            var self = this;

            self.addPetridish = function (content) {
		        var tableItems = self.tableItems,
			        i = 0;
		        while(i < tableItems.length) {
			        if(tableItems[i] === null) {
				        tableItems[i] = content;
				        return i;
			        }
			        i++;
		        }
		        return -1;
	        };

	        self.fillPetridish = function (position, content) {
		        self.tableItems[position].addContent(content);
	        };

	        self.hasPetridishPlaceFor = function (position, content) {
		        return self.tableItems[position].hasPlaceFor(content);
	        };

	        self.emptyPetridish = function (position) {
		        self.tableItems[position] = new Container({maxConcentration: 10});
	        };

	        self.isPetridishEmpty = function (position) {
		        return self.tableItems[position].isEmpty();
	        };

	        self.getTableItem = function (position) {
		        return self.tableItems[position];
	        };

	        self.removeTableItem = function (position) {
		        self.tableItems[position] = null;
	        };

	        self.addTestTubeAtPos = function (content, position) {
		        if(self.testTubes[position] !== null) {
			        return false;
		        }
		        self.testTubes[position] = content;
		        return true;
	        };

	        self.isTestTubeSlotEmpty = function (position) {
		        return (self.testTubes[position] === null);
	        };

	        self.fillTube = function (position, content) {
		        self.testTubes[position].addContent(content);
	        };

	        self.isTubeEmpty = function (position) {
		        return self.testTubes[position].isEmpty();
	        };

	        self.hasTubePlaceFor = function (position, content) {
		        return self.testTubes[position].hasPlaceFor(content);
	        };

	        self.emptyTube = function (position) {
		        self.testTubes[position] = new Container();
	        };

	        self.getTube = function (position) {
		        return self.testTubes[position];
	        };

	        self.removeTestTubeAtPos = function (position) {
		        self.testTubes[position] = null;
	        };

	        self.addTubeToCentrifuge = function (content) {
		        var centrifugeTubes = self.centrifugeTubes,
			        i = 0;
		        while(i < centrifugeTubes.length) {
			        if(centrifugeTubes[i] === null) {
				        centrifugeTubes[i] = content;
				        return i + 1;
			        }
			        i++;
		        }
		        return 0;
	        };

	        /**
	         * @return tube or null.
	         */
	        self.getTubeFromCentrifuge = function () {
		        var centrifugeTubes = self.centrifugeTubes,
			        i = centrifugeTubes.length - 1;
		        while(i >= 0) {
			        if(centrifugeTubes[i] !== null) {
				        return centrifugeTubes[i];
			        }
			        i--;
		        }
		        return null;
	        };

	        self.removeTubeFromCentrifuge = function () {
		        var centrifugeTubes = self.centrifugeTubes,
			        i = centrifugeTubes.length - 1;
		        while(i >= 0) {
			        if(centrifugeTubes[i] !== null) {
				        centrifugeTubes[i] = null;
				        return;
			        }
			        i--;
		        }
		        return null;
	        };

	        self.getCentrifugeTubeCount = function () {
		        var centrifugeTubes = self.centrifugeTubes,
			        i = centrifugeTubes.length - 1;
		        while(i >= 0 && centrifugeTubes[i] === null) {
			        i--;
		        }
		        return i + 1;
	        };

	        self.isODEmpty = function () {
		        return (self.OD === null);
	        };

	        self.addTubeToOD = function (content) {
		        self.OD = content;
	        };

	        self.getTubeFromOD = function () {
		        return self.OD;
	        };

	        self.emptyOD = function () {
		        self.OD = null;
	        };

	        self.isBlenderDirty = function () {
		        return self.blender.dirty;
	        };
        }
    });

    return Worktable2Model;
});
