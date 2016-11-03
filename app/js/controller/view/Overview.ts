import ko = require('knockout');

import BaseViewController = require('controller/view/Base');
import i18n = require('service/Localization');

import tutorialController = require('controller/Tutorial');
import popupController = require('controller/Popup');
import gameState = require('model/GameState');

class Overview extends BaseViewController {
    constructor() {
        super('overview');

        ko.rebind(this);
    }

    handleDoorClick() {
        popupController.showDoor();
    }

    enter() {
        if (gameState.askTutorial()) {
            gameState.askTutorial(false);

            popupController.offer('popup.ask_tutorial.header', 'popup.ask_tutorial.body')
                .done(() => {
                    tutorialController.startTutorial();
                });
        }

        if (gameState.askBeforeNavigating && !window.onbeforeunload) {
            window.onbeforeunload = () => {
                return i18n.text('common.navigateAway');
            };
        }
    }
}

export = Overview;
