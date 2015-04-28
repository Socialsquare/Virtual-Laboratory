import ko = require('knockout');
import $ = require('jquery');
import PopupModel = require('model/Popup');

class GuideModel extends PopupModel {

    constructor(experimentController, popupController) {
        super('popup-guide', {
            experiment: experimentController.activeExperiment(),
            activeTask: experimentController.activeTask()
        }, popupController);

        this.experimentController = experimentController;
    }

    public postRender = () => {
        $('#popup-container .inner').scrollTop(this.experimentController.scrollAmount);
    }

    public hide = (domElement) => {
        this.experimentController.scrollAmount = $('#popup-container .inner').scrollTop();

        this.popupController.hide(this);
    }
}

export = GuideModel;
