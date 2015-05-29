import ko = require('knockout');

import BaseComputer = require('controller/view/computer/Base');
import ComputerScreenType = require('model/type/ComputerScreen');

class Menu extends BaseComputer {

    constructor() {
        super('computer-menu', 'computer.menu');

        ko.rebind(this);
    }

    screenChanger(screenName) {
        return () => this.changeScreen(ComputerScreenType[screenName]);
    }
}

export = Menu;
