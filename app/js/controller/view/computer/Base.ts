import ko = require('knockout');

import BaseViewController = require('controller/view/Base');

class BaseComputer extends BaseViewController {

    public title: KnockoutObservable<string>;

    constructor(templateName, title) {
        super(templateName)

        this.title = ko.observable(title);
    }

    public changeScreen = (name) => {
        this.gameState.activeComputerScreen(name);
    }
}

export = BaseComputer;
