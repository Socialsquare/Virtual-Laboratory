import ko = require('knockout');
import ImageHelper = require('utils/ImageHelper');
import TextHelper = require('utils/TextHelper');

class PopupModel {

    public templateName;
    public data;
    public ImageHelper;
    public TextHelper;
    public popupController;

    constructor(templateName, data, popupController) {
        this.data = data;
        this.templateName = templateName;
        this.ImageHelper = ImageHelper;
        this.TextHelper = TextHelper;
        this.popupController = popupController;
    }

    public hide = () => {
        this.popupController.hide(this);
    }

    public postRender = () => {
        // noop
    }
}

export = PopupModel;
