import experimentData = require('json!testdatadir/experiments.json');

import ExperimentModel = require('model/Experiment');
import ApparatusLocationType = require('model/type/ApparatusLocation');
import ApparatusType = require('model/type/Apparatus');

describe('Experiment model', () => {

    it('should be using the specified apparatus', () => {
        var experiment = new ExperimentModel(experimentData[0]);

        expect(experiment.apparatus.apparatusEnabled(ApparatusLocationType.CORNER,
                                                     ApparatusType.CORNER_FOOBAR)).toBeTruthy();

        expect(experiment.apparatus.apparatusEnabled(ApparatusLocationType.UV_ROOM,
                                                     ApparatusType.UV_ROOM_GEL)).toBeTruthy();
    });
});
