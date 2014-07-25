define([
    'knockout',
    'lodash',
    'service/Base',
    'json!datadir/localization.json'
], function (ko, _, BaseService, localizationData) {

    var Localization = BaseService.extend({
        constructor: function () {
            var self = this;

            self.langData = ko.observable(localizationData);
            self.selectedLanguage = ko.observable('dk');

            self.setLanguage = function (lang) {
                self.selectedLanguage(lang);
            };

            self.text = function (id) {
                if (_.isObject(id)) {
                    var lang = self.selectedLanguage();

                    if (!id[self.selectedLanguage()]) {
                        // fallback to first available lang in alphabetical order
                        lang = _(id).keys().sortBy(_.identity).find();
                    }

                    return id[lang];
                }

                var text = self.langData()[self.selectedLanguage()][id];

                if (!text) throw 'Unknown localization: ' + id + ' for language ' + self.selectedLanguage();

                return text;
            };
        }
    });

    return new Localization();
});
