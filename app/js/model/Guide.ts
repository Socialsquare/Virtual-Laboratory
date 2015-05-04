import ko = require('knockout');
import $ = require('jquery');

import experimentController = require('controller/Experiment');
import PopupModel = require('model/Popup');

class GuideModel extends PopupModel {

    constructor(experimentController, popupController) {
        super('popup-guide', {
            experiment: experimentController.activeExperiment(),
            activeTask: experimentController.activeTask()
        }, popupController);

        ko.rebind(this);
    }

    postRender() {
        $('#popup-container .inner').scrollTop(experimentController.scrollAmount);
    }

    hide() {
        experimentController.scrollAmount = $('#popup-container .inner').scrollTop();

        this.popupController.hide(this);
    }
}

export = GuideModel;
