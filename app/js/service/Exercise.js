define([
    'lodash',
    'service/Base',
    'model/Exercise'
], function ( _, BaseService, ExerciseModel) {

    var ExerciseService = BaseService.extend({
        getExercises: function () {

            var promise = $.Deferred();
            this.get('experiments')
                .done(function (elements) {
                    var result = _.map(elements, function (element) {
                        return new ExerciseModel(element);
                    });
                    promise.resolve(result);
                });

            return promise;
        }
    });

    return new ExerciseService();
});
