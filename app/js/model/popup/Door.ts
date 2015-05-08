import ko = require('knockout');

import router = require('controller/Router');

import PopupModel = require('model/Popup');

class Door extends PopupModel {

    constructor() {
        super('popup-door');

        ko.rebind(this);
    }

    goto(name: string) {
        this.hide();
        router.navigate(name);
    }
}

export = Door;
