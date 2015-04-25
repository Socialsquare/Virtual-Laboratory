import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');
import Base = require('base');

import router = require('controller/Router');

import helpService = require('service/Help');
import PopupModel = require('model/Popup');

class Help extends PopupModel {

    public entries;
    public selectedEntry;

    constructor(popupController) {
        super('popup-instruments', this, popupController);

        this.entries = helpService.getHelpEntries();
        this.selectedEntry = ko.observable(this.entries[0]);
    }

    public selectEntry = (entry) => {
        this.selectedEntry(entry);
    }

    public goToArea = () => {
        var entry = this.selectedEntry();

        if (entry.route) {
            router.navigate(entry.route);

            this.hide();
        }
    }
}

export = Help
