import ko = require('knockout');
import _ = require('lodash');

import MouseCageModel = require('model/MouseCage');
import GlucoseBagModel = require('model/GlucoseBag');
import ActivationType = require('model/type/Activation');
import experimentController = require('controller/Experiment');
import hudController = require('controller/HUD');
import gameState = require('model/GameState');

class GlucoseBag {

    public mouseCage: MouseCageModel;
    public glucoseBag: GlucoseBagModel;
    public wasActivated: boolean = false;
    private STEP: number;

    constructor(mouseCage: MouseCageModel) {
        this.mouseCage = mouseCage;
        var gb = mouseCage.glucoseBag;
        this.glucoseBag = gb;
        this.STEP = 0.05;
        
        ko.postbox.subscribe("glucoseBagStatusToggleTopic", (newValue:boolean) => {
            console.log("glucoseBagStatusToggleTopic: " + newValue);
            if (newValue === true) {
                this.activate();
            } else {
                this.deactivate();
            }
        }, this); 

        ko.rebind(this);
    }
    
    statusToggle() {
        if (this.glucoseBag.status()) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        this.glucoseBag.activate();
        hudController.flashTimePassing(60);
        experimentController.triggerActivation(ActivationType.GLUCOSE_BAG, this);
        if (! this.wasActivated){
            this.wasActivated = true;
        }
    }
    
    deactivate() {
        this.glucoseBag.deactivate();
        experimentController.triggerActivation(ActivationType.GLUCOSE_BAG, this);
        hudController.hideTimePassing();
    }

    increaseRate() {
        if (this.glucoseBag.status()) {
            this.glucoseBag.glucoseInfusionRate(this.glucoseBag.glucoseInfusionRate()+ this.STEP);
        }
    }

    decreaseRate() {
        if (this.glucoseBag.status()) {
            var newRate = this.glucoseBag.glucoseInfusionRate() - this.STEP;
            if (newRate < 0) newRate = 0;
            this.glucoseBag.glucoseInfusionRate(newRate)
        }
    }
    
    dispose(){
        // ko.postbox unsubscribe from "glucoseBagStatusToggleTopic"
    }
}

export = GlucoseBag;
