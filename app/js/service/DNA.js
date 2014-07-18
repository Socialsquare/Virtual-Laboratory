define([
    'lodash',
    'jquery',
    'service/Base',
    'model/DNAElement',
    'json!datadir/dna.json'
], function (_, $, BaseService, DNAElement, DNAData) {
    var DNAService = BaseService.extend({
        getDNAElements: function () {
            return _.map(DNAData, function (element) {
                return new DNAElement(element);
            });
        }
    });

    return DNAService;
});
