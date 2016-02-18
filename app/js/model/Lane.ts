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
        var blueStain = super.findByType(LiquidType.BLUE_STAIN);
        
        if ((blueStain)) { 
            this.videoController.play('gel-electro-lane-'+this.laneNum, false);
            _.delay(() => this.done(true), 8000);
        }
    }

    hasFFD() {
        var ffd = super.findByType(LiquidType.FREE_FLOATING_DNA);
        return !!ffd;
    }

    hasDiabeticFFD() {
        var ffd:FreeFloatingDNAModel = <FreeFloatingDNAModel>super.findByType(LiquidType.FREE_FLOATING_DNA);
        return (!!ffd && ffd.bloodType() === MouseBloodType.DIABETIC);
    }

    isStained() {
        var blueStain = super.findByType(LiquidType.BLUE_STAIN);
        return !!blueStain;
    }
}

export = Lane;
