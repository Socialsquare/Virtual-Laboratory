import ko = require('knockout');
import BaseComputer = require('controller/view/computer/Base');

class Menu extends BaseComputer {

    constructor() {
        super('computer-menu', 'computer.menu');

        ko.rebind(this);
    }

    screenChanger(screenName) {
        return () => this.changeScreen(screenName);
    }
}

export = Menu;
