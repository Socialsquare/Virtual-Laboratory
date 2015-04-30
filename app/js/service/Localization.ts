import ko = require('knockout');
import _ = require('lodash');

import localizationData = require('json!datadir/localization.json');


class Localization {

    static langData = ko.observable(localizationData);
    static selectedLanguage = ko.observable('dk');

    static setLanguage(lang: string) {
        Localization.selectedLanguage(lang);
    }

    static text(id: string) {
        if (_.isObject(id)) {
            var lang = Localization.selectedLanguage();

            if (!id[Localization.selectedLanguage()]) {
                // fallback to first available lang in alphabetical order
                lang = _(id).keys().sortBy(_.identity).find();
            }

            return id[lang];
        }

        var text = Localization.langData()[Localization.selectedLanguage()][id];

        if (!text) throw 'Unknown localization: ' + id + ' for language ' + Localization.selectedLanguage();

        return text;
    }
}

export = Localization;
