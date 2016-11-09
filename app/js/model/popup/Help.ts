import ko = require('knockout');

import router = require('controller/Router');
import PopupModel = require('model/Popup');
import i18n = require('service/Localization');
import helpService = require('service/Help');

class Help extends PopupModel {

    public entries;
    public selectedEntry;

    constructor() {
        super('popup-help');

        this.entries = helpService.getHelpEntries();
        this.selectedEntry = ko.observable(this.entries[0]);
    }

    selectEntry(entry) {
        this.selectedEntry(entry);
    }

    goToArea() {
        var entry = this.selectedEntry();

        if (entry.route) {
            router.navigate(entry.route);

            this.hide();
        }
    }

    onBeforeOpen () {
        this.entries.sort((a, b) => {
            const titleA = i18n.text(a.title)
            const titleB = i18n.text(b.title)
            if (titleA > titleB) { return 1; }
            if (titleA < titleB) { return -1; }
            return 0;
        })
    }
}

export = Help
