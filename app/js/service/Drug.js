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

                var promise = $.Deferred();

                var testPath4 = 'data/drugs-data/' + drugConfigurationString + '.json';
                var test4 = $.getJSON(testPath4).done(function(data) {
                    promise.resolve(
                        {
                            weight: data.weight + 'g/mol',
                            pKa: data.pka,
                            logD: data.logD,
                            logP: data.logP
                        }
                    );
                });


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

            //Given LogD, it can be determined where in the body the drug can go
            self.getDrugPassages = function(logD) {
                var values = {};
                values.canPassSkin = logD >= 4; //Jannick also proposed > 3, but said 'start with 4'
                values.canPassBBB = logD >= 2 && logD <= 3;
                values.canPassBlood = logD <= 5;
                values.canPassIntestine = logD >= 1;

                return values;
            }
        }
    });

    return new Drug();
});
