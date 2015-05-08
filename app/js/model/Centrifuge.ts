import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import TextHelper = require('utils/TextHelper');

import CompositeContainerModel = require('model/CompositeContainer');
import TubeModel = require('model/Tube');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');


// The slots are modelled in a circle, so for instance: slot0 = top,
// slot1 = right, slot2 = bottom, slot3 = left, or something to that
// effect.


class CentrifugeModel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(4, ContainerType.TUBE, ContainerType.HEATER);

        this.status = ko.observable(false);

        ko.rebind(this);
    }

    validateBalance() {
        var slot0 = this.get(0);
        var slot1 = this.get(1);
        var slot2 = this.get(2);
        var slot3 = this.get(3);

        // Are tubes in valid positions
        if (!slot0 !== !slot2 || !slot1 !== !slot3)
            return false;

        // Is slot0 and slot2 both full or empty
        if (slot0 && slot2 && (!slot0.isEmpty() !== !slot2.isEmpty()))
            return false;

        // Is slot1 and slot3 both full or empty
        if (slot1 && slot3 && (!slot1.isEmpty() !== !slot3.isEmpty()))
            return false;

        return true;
    }

    tryExtractContents(tube: TubeModel) {
        if (!tube || tube.isEmpty())
            return;

        //TODO! extract correct things based on contents
        if (tube.contains(LiquidType.MOUSE_BLOOD)) {
            var i18n = TextHelper.prettyNameFromType;
            var options = [
                { key: i18n(LiquidType.BUFFY_COAT), value: LiquidType.BUFFY_COAT },
                { key: i18n(LiquidType.RED_BLOOD_CELLS), value: LiquidType.RED_BLOOD_CELLS },
                { key: i18n(LiquidType.PLASMA), value: LiquidType.PLASMA },
            ];

            popupController.select<LiquidType>('centrifuge.extraction.header', 'centrifuge.extraction.body', options).then((selectedObject) => {
                alert("create a " + selectedObject.value);
            });
        }
    }

    activate() {
        if (this.status())
            return;

        if (!this.validateBalance()) {
            popupController.notify('centrifuge.unbalanced.header', 'centrifuge.unbalanced.body');
            return;
        }

        this.status(true);

        _.delay(() => {
            _.each(this.containers(), this.tryExtractContents);
            this.status(false);
        }, 2000);
    }
}

export = CentrifugeModel;
