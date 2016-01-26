import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');
import popupController = require('controller/Popup');
import hudController = require('controller/HUD');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import LocationType = require('model/type/Location');
import ActivationType = require('model/type/Activation');

import CompositeContainerModel = require('model/CompositeContainer');
import SimpleContainerModel = require('model/SimpleContainer');
import TubeModel = require('model/Tube');
import BuffyCoatModel = require('model/BuffyCoat');
import ClumpedCellsModel = require('model/ClumpedCells');

class HeaterModel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;
    public containers: KnockoutObservableArray<TubeModel>;

    constructor() {
        super(3, ContainerType.TUBE, ContainerType.HEATER);

        this.status = ko.observable(false);
        this.location(LocationType.HEATER);

        ko.rebind(this);
    }

    _addAt(position: number, container: SimpleContainerModel) {
        var didAdd = super._addAt(position, container);

        if (didAdd) {
            container.liquidsAdded.add(this.checkTubes);
        }

        return didAdd;
    }

    remove(position: number) {
        var container = this.get(position);
        if (container)
            container.liquidsAdded.remove(this.checkTubes);

        super.remove(position);
    }

    checkTubes() {
        if (!this.status())
            return;

        _.each(this.containers(), tube => {
            if (!tube) return;

            // When mixing lysis, salt and buffy coat you get free
            // floating dna with the same blood type as the buffy coat
            var requiredForFFD = [
                LiquidType.LYSIS,
                LiquidType.SALT_WATER,
                LiquidType.BUFFY_COAT
            ];

            if (tube.containsAll(requiredForFFD)) {

                var buffyCoat = <BuffyCoatModel>tube.findByType(LiquidType.BUFFY_COAT);

                tube.clearContents();

                tube.add(new ClumpedCellsModel(buffyCoat.bloodType()));

                popupController.message(
                    'popup.clumped_cells_created.header',
                    'popup.clumped_cells_created_screen.body'
                );
            }
        });
    }

    toggle() {
        this.status.toggle();

        if (this.status()) {
            experimentController.triggerActivation(ActivationType.HEATER, this);
        }

        this.checkTubes();
    }
}

export = HeaterModel;
