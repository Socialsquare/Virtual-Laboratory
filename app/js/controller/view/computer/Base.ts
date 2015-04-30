import ko = require('knockout');

import BaseViewController = require('controller/view/Base');

import ActivationType = require('model/type/Activation');
import ComputerScreenType = require('model/type/ComputerScreen');

class BaseComputer extends BaseViewController {

    public Screens: ComputerScreenType;

    public title: KnockoutObservable<string>;

    constructor(templateName, title) {
        super(templateName)

        this.Screens = ComputerScreenType;

        this.title = ko.observable(title);
    }

    public changeScreen = (name) => {
        this.gameState.activeComputerScreen(name);
    }
}

export = BaseComputer;
