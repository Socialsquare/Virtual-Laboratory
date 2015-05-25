import ko = require('knockout');

import BaseViewController = require('controller/view/Base');

import tutorialController = require('controller/Tutorial');
import popupController = require('controller/Popup');

class Overview extends BaseViewController {
    constructor() {
        super('overview');

        ko.rebind(this);
    }

    handleDoorClick() {
        popupController.showDoor();
    }

    enter() {
        if (this.gameState.askTutorial()) {
            this.gameState.askTutorial(false);

            popupController.confirm('popup.ask_tutorial.header', 'popup.ask_tutorial.body')
                .done(() => {
                    tutorialController.startTutorial();
                });
        }
    }
}

export = Overview;
