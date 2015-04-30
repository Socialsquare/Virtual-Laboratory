import SidegroupModel = require('model/Sidegroup');

import drugData = require('json!testdatadir/drugs.json');

describe('Scaffold model', () => {

    it('should parse correct values from raw data', () => {

        var sidegroup = new SidegroupModel(drugData.sidegroups[0]);

        // Check some random values
        expect(sidegroup.id).toBe(14);
        expect(sidegroup.info.pKa).toBe(17.7);
        expect(sidegroup.file()).toBe('assets/svgs/sidegroup_14.svg');
    });
});
