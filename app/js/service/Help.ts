import _ = require('lodash');

import HelpEntry = require('model/HelpEntry');
import helpData = require('json!datadir/help.json');

class HelpService {

    static getHelpEntries() {
        return _.map(helpData, (entry) => new HelpEntry(entry));
    }
}

export = HelpService;
