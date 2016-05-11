import ko = require('knockout');
import Utils = require('utils/utils');

import experimentController = require('controller/Experiment');

import CompositeContainerModel = require('model/CompositeContainer');

import ContainerType = require('model/type/Container');
import ActivationType = require('model/type/Activation');


class ODMachine extends CompositeContainerModel {

    public hasTube: KnockoutComputed<boolean>;
    public display: KnockoutComputed<string>;

    constructor() {
        super(1, ContainerType.TUBE, ContainerType.OD_MACHINE);

        this.hasTube = ko.pureComputed(() => {
            return this.hasContainerAt(0);
        });


        this.display = ko.pureComputed(() => {
            if (!this.hasTube())
                return '';

            var logConc = this.get(0).getRealConcentration();
            if (logConc === 0)
                return '0.0';

            return '' + logConc.toFixed(1);
        });

        this.display.subscribe((currVal) => {
            experimentController.triggerActivation(ActivationType.OD, currVal);
        });
    }

}

export = ODMachine;
