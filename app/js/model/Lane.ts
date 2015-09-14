import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
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

    electrofy() {
        var ffd:FreeFloatingDNAModel = <FreeFloatingDNAModel>super.findByType(LiquidType.FREE_FLOATING_DNA);
        var blueStain = super.findByType(LiquidType.BLUE_STAIN);
        
        if ((ffd && blueStain) && (ffd.bloodType() === MouseBloodType.DIABETIC)) {
            this.value(100);
        }
    }

    hasFFD() {
        var ffd = super.findByType(LiquidType.FREE_FLOATING_DNA);
        return !!ffd;
    }

    isStained() {
        var blueStain = super.findByType(LiquidType.BLUE_STAIN);
        return !!blueStain;
    }
}

export = Lane;
