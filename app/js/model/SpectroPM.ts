import ko = require('knockout');

import LocationType = require('model/type/Location');
import ContainerType = require('model/type/Container');

import CompositeContainerModel = require('model/CompositeContainer');
import SimpleContainerModel = require('model/SimpleContainer');

class SpectroPM {

    public microSlot: CompositeContainerModel;

    constructor() {

        this.microSlot = new CompositeContainerModel(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);
        this.microSlot.location(LocationType.SPECTROPM);

        this.microSlot.addAt = (position: number, container: SimpleContainerModel) => {

            var addSucces = this.microSlot._addAt(position, container);

            if (addSucces) {
                _.each(container.liquids(), (liquid) => {
                    liquid.react(container);
                });
            }
            return this.microSlot;
        };

        ko.rebind(this);
    }

    reset() {
        this.microSlot.removeAll();
    }
}

export = SpectroPM;
