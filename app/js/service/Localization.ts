import ko = require('knockout');
import _ = require('lodash');

import localizationData = require('json!datadir/localization.json');

class Localization {

    static langData = localizationData;
    static selectedLanguage = ko.observable('dk');

    static setLanguage(lang: string) {
        Localization.selectedLanguage(lang);
    }

    static text(id: string | {}) {
        if (typeof id === 'string') {
            var text = Localization.langData[Localization.selectedLanguage()][id];

            if (!text) throw 'Unknown localization: ' + id + ' for language ' + Localization.selectedLanguage();

            return text;
        }

        var lang = Localization.selectedLanguage();

        if (!id[Localization.selectedLanguage()]) {
            // fallback to first available lang in alphabetical order
            lang = _(id).keys().sortBy(_.identity).first();
        }

        return id[lang];
    }
}

export = Localization;
