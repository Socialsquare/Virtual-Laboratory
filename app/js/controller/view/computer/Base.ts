import ko = require('knockout');

import BaseViewController = require('controller/view/Base');
import gameState = require('model/GameState');


class BaseComputer extends BaseViewController {

    public title: KnockoutObservable<string>;

    constructor(templateName, title) {
        super(templateName);

        this.title = ko.observable(title);

        ko.rebind(this);
    }

    changeScreen(name) {
        gameState.activeComputerScreen(name);
    }
}

export = BaseComputer;
