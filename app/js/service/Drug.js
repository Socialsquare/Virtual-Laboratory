define([
    'knockout',
    'jquery',
    'lodash',
    'service/Base',
    'model/Scaffold',
    'model/Sidegroup',
    'json!../../data/drugs.json'

], function (ko, $, _, BaseService, ScaffoldModel, SidegroupModel, drugsData) {

    var Drug = BaseService.extend({

        constructor: function () {
            var self = this;

            self.getDrugInfo = function (drugConfigurationString) {
                console.log('Dummy info for drug: ' + drugConfigurationString);

                var promise = $.Deferred();

                setTimeout(function () {
                    promise.resolve({
                        pH: 4.7,
                        vildTing: "Hej"
                    });
                }, 1000);

                return promise;
            };

            self.getScaffold = function (name) {
                var raw = _.find(drugsData.scaffolds, function (obj) {
                    return obj.name === name;
                });

                return new ScaffoldModel(raw);
            };

            self.scaffolds = _.map(drugsData.scaffolds, function (values) {
                return new ScaffoldModel(values);
            });

            self.sidegroups = _.map(drugsData.sidegroups, function (values) {
                return new SidegroupModel(values);
            });

            // TODO: properties
        }
    });

    return new Drug();
});
