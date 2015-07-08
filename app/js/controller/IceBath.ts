import ko = require('knockout');
import $ = require('jquery');

import popupController = require('controller/Popup');

import CompositeContainerController = require('controller/CompositeContainer');

import LiquidType = require('model/type/Liquid');
import ContainerType = require('model/type/Container');
import IceBathModel = require('model/IceBath');

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
                .confirm('popup.warn_icebath_ffd.header', 'popup.warn_icebath_ffd.body');
        }

        return $.Deferred().resolve();
    }
}

export = IceBath;
