import ko = require('knockout');

import BaseViewController = require('controller/view/Base');
import experimentController = require('controller/Experiment');

import ActivationType = require('model/type/Activation');
import ComputerScreenType = require('model/type/ComputerScreen');

class BaseComputer extends BaseViewController {

    constructor(templateName, title) {
        super()

        this.computer = this.gameState.computer;
        this.experimentController = experimentController;
        this.Screens = ComputerScreenType;

        this.templateName = ko.observable(templateName);
        this.title = ko.observable(title);
    }

    public changeScreen = (name) => {
        this.gameState.activeComputerScreen(name);
    }
}

export = BaseComputer;
