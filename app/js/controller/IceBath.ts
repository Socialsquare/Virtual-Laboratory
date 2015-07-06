import ko = require('knockout');
import $ = require('jquery');

import popupController = require('controller/Popup');

import CompositeContainerController = require('controller/CompositeContainer');

import LiquidType = require('model/type/Liquid');
import ContainerType = require('model/type/Container');
import IceBathModel = require('model/IceBath');
import SimpleContainerModel = require('model/SimpleContainer');

import DragHelper = require('utils/DragHelper');

class IceBath extends CompositeContainerController {

    public compContainer: IceBathModel;

    constructor(iceBathModel: IceBathModel) {
        super(iceBathModel);

        ko.rebind(this);
    }

    dragDropInterceptor(tube, fromContainer, toContainer) {
        if (tube.contains(LiquidType.FREE_FLOATING_DNA)
            && toContainer.type() !== ContainerType.ICE_BATH) {
            return popupController
                .confirm('experiment.change.header', 'experiment.change.body');
        }

        return $.Deferred().resolve();
    }
}

export = IceBath;
