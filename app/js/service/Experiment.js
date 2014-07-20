define([
    'lodash',
    'service/Base',
    'model/Experiment'
], function ( _, BaseService, ExperimentModel) {

    var Experiment = BaseService.extend({

        getExperiments: function () {
            var promise = $.Deferred();
            this.get('/data/experiments.json')
                .done(function (elements) {
                    var result = _.map(elements, function (element) {
                        return new ExperimentModel(element);
                    });
                    promise.resolve(result);
                });

            return promise;
        }
    });

    return new Experiment();
});
