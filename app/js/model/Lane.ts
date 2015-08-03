import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
import LaneModel = require('model/Lane');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class Lane extends SimpleContainerModel {

    public value: KnockoutObservable<number>;

    constructor() {
        super(ContainerType.LANE, 100); // Math.pow(10, 13)
        this.value = ko.observable(0);

        ko.rebind(this);
    }

    calculateValue() {
        var ffd = <FreeFloatingDNAModel>super.findByType(LiquidType.FREE_FLOATING_DNA);
        if (ffd) {
            if (ffd.bloodType() === MouseBloodType.DIABETIC) {
                this.value = 100;
            } else {
                this.value = 10;
            }
        } else {
            this.value = 0;
        }
        var value = this.value;
    }
}

export = Lane;
