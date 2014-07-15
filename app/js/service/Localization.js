define([
    'knockout',
    'lodash',
    'service/Base',
    'json!localization.json'
], function (ko, _, BaseService, localizationData) {

    var Localization = BaseService.extend({
        constructor: function () {
            var self = this;

            self.langData = ko.observable(localizationData);
            self.langCode = ko.observable('dk');

            self.setLanguage = function (langCode) {
                self.langCode(langCode);
            };

            self.text = function (id) {
                var text = self.langData()[self.langCode()][id];

                if (!text) throw 'Unknown localization: ' + id + ' for language ' + self.langCode();

                return text;
            };
        }
    });

    return new Localization();
});
