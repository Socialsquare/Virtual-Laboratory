import _ = require('lodash');

import DNAElement = require('model/DNAElement');
import DNAData = require('json!datadir/dna.json');


class DNAService {

    static getDNAElements() {
        return _.map(DNAData, (element) => {
            return new DNAElement(element);
        });
    }
}

export = DNAService;
