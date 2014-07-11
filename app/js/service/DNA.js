define([
    'lodash',
    'service/Base',
    'model/DNAElement'
], function ( _, BaseService, DNAElement) {
    var DNAService = BaseService.extend({
        getDNAElements: function () {

            var promise = $.Deferred();
            this.get('dna_elements')
                .done(function (elements) {
                    var result = _.map(elements, function (element) {
                        return new DNAElement(element);
                    });
                    promise.resolve(result);
                });

            return promise;
        }
    });

    return DNAService;
});
