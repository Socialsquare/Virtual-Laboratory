import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class Lane extends SimpleContainerModel {

    public value: number;

    constructor() {
        super(ContainerType.LANE, 100); // Math.pow(10, 13)
        this.value = 10;

        ko.rebind(this);
    }

    calculateValue() {
        var ffd = <FreeFloatingDNAModel>super.findByType(LiquidType.FREE_FLOATING_DNA);
        if (ffd) {
            if (ffd.bloodType() === MouseBloodType.DIABETIC) {
                this.value = 120;
            } else {
                this.value = 30;
            }
        }
    }
}

export = Lane;
