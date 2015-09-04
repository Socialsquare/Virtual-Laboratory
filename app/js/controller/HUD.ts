import ko = require('knockout');
import _ = require('lodash');

class HUD {
    public showTimePassing: KnockoutObservable<boolean>;

    constructor() {
        this.showTimePassing = ko.observable(false);

        ko.rebind(this);
    }

    flashTimePassing(secs) {
        this.showTimePassing(true);
        _.delay(() => this.showTimePassing(false), secs*1000);
    }

    hideTimePassing() {
        this.showTimePassing(false);
    }
}

export = new HUD();
