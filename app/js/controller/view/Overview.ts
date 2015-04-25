import ko = require('knockout');
import BaseViewController = require('controller/view/Base');
import tutorialController = require('controller/Tutorial');
import FeatureHelper = require('utils/FeatureHelper');


class Overview extends BaseViewController {
    constructor() {
        super('overview');
    }

    public handleDoorClick = () => {
        var vm = this.popupController.show('popup-door', {
            goto: (name) => {
                this.popupController.hide(vm);
                this.router.navigate(name);
            }
        });
    }

    public enter = () => {
        if (this.gameState.askTutorial()) {
            this.gameState.askTutorial(false);

            this.popupController.confirm('popup.ask_tutorial.header', 'popup.ask_tutorial.body')
                .done(() => {
                    tutorialController.startTutorial();
                });
        }
    }
}

export = Overview;
