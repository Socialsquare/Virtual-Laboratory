define([
    'jquery',
    'mapping',
    'service/Base'
], function ($, mapping, BaseService) {
    var DNAService = BaseService.extend({
        getDNAElements: function () {

            var promise = $.Deferred();
            this.get('dna_elements')
                .done(function (elements) {
                    promise.resolve(mapping.fromJS(elements)());
                });

            return promise;
        }
    });

    return DNAService;
});
