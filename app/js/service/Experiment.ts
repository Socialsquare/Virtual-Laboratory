import  _ = require('lodash');

import ExperimentModel = require('model/Experiment');


class Experiment {

    static getExperiments() {
        var promise = $.Deferred();

        $.getJSON('/data/experiments.json').done((elements) => {
            var result = _.map(elements, element => new ExperimentModel(element));
            promise.resolve(result);
        });

        return promise;
    }
}

export = Experiment;
