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

        this.hasTube.subscribe((hasTube) => {
            if (hasTube)
                experimentController.triggerActivation(ActivationType.OD, this.get(0));
        });

        this.display = ko.pureComputed(() => {
            if (!this.hasTube())
                return '';

            var conc = this.get(0).getTotalConcentration();

            if (conc === 0)
                return '0.0';

            var logConc = Utils.math.getBaseLog(10, conc);
            return '' + logConc.toFixed(1);
        });
    }

}

export = ODMachine;
