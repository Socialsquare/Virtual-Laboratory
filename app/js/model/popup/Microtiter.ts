import ko = require('knockout');

import ImageHelper = require('utils/ImageHelper');

import PopupModel = require('model/Popup');
import MicrotiterplateModel = require('model/Microtiterplate');

class Microtiter extends PopupModel {

    public microtiter: MicrotiterplateModel;

    constructor(microtiter: MicrotiterplateModel) {
        super('popup-microtiter');

        this.microtiter = microtiter;

        ko.rebind(this);
    }

    wellImage(index: number) {
        return ImageHelper.microtiterWell(index, this.microtiter);

    }
}

export = Microtiter;
