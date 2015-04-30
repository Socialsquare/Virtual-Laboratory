import ScaffoldModel = require('model/Scaffold');

import drugData = require('json!testdatadir/drugs.json');

describe('Scaffold model', () => {

    it('should parse correct values from raw data', () => {

        var scaffold = new ScaffoldModel(drugData.scaffolds[0]);

        // Check some random values
        expect(scaffold.name).toBe("1");
        expect(scaffold.slots().length).toBe(3);
        expect(scaffold.offset.x).toBe(510);

        // Check some random slot values
        expect(scaffold.slots()[0].index).toBe(2);
        expect(scaffold.slots()[0].optimalLength).toBe(4);
        expect(scaffold.slots()[0].bindingType).toBe("vdw");

        // Check computed
        expect(scaffold.configurationString()).toBe("1_R_R_R");
    });
});
