import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import VideoController = require('controller/Video');

class Lane extends SimpleContainerModel {

    public laneNum: number;
    public done: KnockoutObservable<boolean>;
    public videoController: VideoController;

    constructor(laneNum: number) {
        super(ContainerType.LANE, 100); // Math.pow(10, 13)
        this.laneNum = laneNum;
        this.done = ko.observable(false);
        this.videoController = new VideoController(true);

        ko.rebind(this);
    }

    electrofy() {
        var ffd:FreeFloatingDNAModel = <FreeFloatingDNAModel>super.findByType(LiquidType.FREE_FLOATING_DNA);
        var blueStain = super.findByType(LiquidType.BLUE_STAIN);
        
        if ((ffd && blueStain)) { 
            this.videoController.play('gel-electro-lane-'+this.laneNum, false);
            this.done(true);
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
