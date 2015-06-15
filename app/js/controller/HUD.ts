import ko = require('knockout');
import _ = require('lodash');

class HUD {
    public showTimePassing: KnockoutObservable<boolean>;

    constructor() {
        this.showTimePassing = ko.observable(false);

        ko.rebind(this);
    }

    flashTimePassing() {
        this.showTimePassing(true);
        _.delay(() => this.showTimePassing(false), 2000);
    }
}

export = new HUD();
