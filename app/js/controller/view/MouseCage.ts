import ko = require('knockout');
import _ = require('lodash');

import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');
import GlucoseBagController = require('controller/GlucoseBag');

import BottleModel = require('model/Bottle');
import MouseCageModel = require('model/MouseCage');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

import ContainerFactory = require( 'factory/Container');
import LiquidFactory = require('factory/Liquid');


class MouseCage extends BaseViewController {

    public videoController: VideoController;

    public mousecage: MouseCageModel;
    public mouseDrinking: KnockoutObservable<boolean>;
    public hasMouse: KnockoutComputed<boolean>;    

    public lowBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public highBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public diabetesDevelopedToggle: KnockoutObservable<boolean>;
    public juiceClampMessageToggle: KnockoutObservable<boolean>;

    public simulationIntervalId: number = null;
    public simulationInterval: number = 100;  // millisecond

    public glucoseBagController: GlucoseBagController;
    public bottle: BottleModel;
    private _bloodSugarSubscription = null;

    constructor() {

        super('mousecage');
        
        this.mousecage = this.gameState.mousecage;

        this.videoController = new VideoController(true);
        this.glucoseBagController = new GlucoseBagController(this.mousecage);

        this.mouseDrinking = ko.observable(false);

        this.lowBloodSugarWarningToggle = ko.observable(false);
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);
        this.juiceClampMessageToggle = ko.observable(false);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

        this.hasMouse = ko.pureComputed(():boolean =>{
            return <boolean><any>this.mousecage.mouse();
        })
        
        ko.rebind(this);
    }
    
    public shouldShowDiabetesDeveloped = (bloodSugar) => {
        return (bloodSugar >= this.mousecage.mouse().maxBloodSugar())
            && !this.diabetesDevelopedToggle()
            && (this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL)
            && !super.apparatusEnabled('MOUSE_CAGE_GLUCOSE_BAG', 'GLUCOSE_BAG_CLAMP');
    }
    
    public shouldShowHighBloodSugarWarning = (bloodSugar) => {
        return (bloodSugar > (this.mousecage.mouse().maxBloodSugar() * 0.8))
            && !this.highBloodSugarWarningToggle()
            && (this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL)
            && !super.apparatusEnabled('MOUSE_CAGE_GLUCOSE_BAG', 'GLUCOSE_BAG_CLAMP');
    }
    
    public shouldShowLowBloodSugarWarning = (bloodSugar) => {
        return ((bloodSugar < 1.5)
            && !this.lowBloodSugarWarningToggle());
    }
    
    public onBloodSugarChange = (bloodSugar) => {
        if (this.shouldShowLowBloodSugarWarning(bloodSugar)) {
            this.lowBloodSugarWarningToggle(true);
            this.popupController.message('mouse.warning_insulin.header',
                                         'mouse.warning_insulin.body');
        } else if (this.shouldShowHighBloodSugarWarning(bloodSugar)) {
            this.highBloodSugarWarningToggle(true);
            this.popupController.message('mouse.warning_diabetes_risk.header',
                                         'mouse.warning_diabetes_risk.body');
        } else if (this.shouldShowDiabetesDeveloped(bloodSugar)) {
            this.diabetesDevelopedToggle(true);
            this.popupController.message('mouse.warning_diabetes.header',
                                         'mouse.warning_diabetes.body');
            this.mousecage.mouse().mouseBloodType(MouseBloodType.DIABETIC);
        }
    }

    /**
     * Give a fraction of infusion to the mouse.
     *
     */
    nextInfusionDose() {
        var infusionRate = this.mousecage.glucoseBag.glucoseInfusionRate();
        var msInMinute = 1000 * 60;
        var infusionDose = infusionRate * this.simulationInterval / msInMinute;
        this.mousecage.mouse().giveInfusion(infusionDose);
    }

    nextTimeStep() {
        if (!this.mousecage.hasMouse()) return;
        
        if (this.apparatusEnabled('MOUSE_CAGE_GLUCOSE_BAG', 'GLUCOSE_BAG_CLAMP'))
            this.nextInfusionDose();

        this.mousecage.mouse().nextBloodStep();
        ko.postbox.publish("mouseCageMouseBloodSugarTopic",
            this.mousecage.mouse().bloodSugar());
        this.mousecage.mouse().nextHeartStep();
        ko.postbox.publish("mouseCageMouseHeartRateTopic",
            this.mousecage.mouse().heartRate());
        
        if (this.mousecage.mouse().hasLethalBloodSugar()) {
            this.toggleSimulation(false);

            this.videoController.play('fast-die-insulin', false).then(() => {
                this.mousecage.mouse().alive(false);
                this.mouseDrinking(false);
                this.popupController.message('mouse.died_glucose.header', 'mouse.died_glucose.body');
            });
        }
    }

    injectionFromState() {
        if (!this.mousecage.hasMouse()) return;

        if (this.mousecage.mouse().alive()) {
            switch (this.mousecage.mouse().mouseType()) {
            case MouseType.HEALTHY:
                return this.videoController.play('fast-injection', false);

            case MouseType.SMALLPOX:
                return this.videoController.play('smallpox-injection', false);

            case MouseType.GOUT:
                return this.videoController.play('slow-injection-body-gout', false);
            }
        }
    }

    runFromState() {
        if (!this.mousecage.hasMouse()) return;

        if (!this._bloodSugarSubscription) {
            this._bloodSugarSubscription =
                this.mousecage.mouse().bloodSugar.subscribe(this.onBloodSugarChange);
        }

        if (this.mousecage.mouse().alive()) {
            switch (this.mousecage.mouse().mouseType()) {
            case MouseType.HEALTHY:
                this.videoController.play('fast-loop', true);
                break;

            case MouseType.SMALLPOX:
                this.videoController.play('smallpox-loop', true);
                break;

            case MouseType.GOUT:
                this.videoController.play('slow-loop-gout', true);
                break;

            case MouseType.INSOMNIA:
                this.videoController.play('slow-loop', true);
                break;

            case MouseType.PSORIASIS:
                this.videoController.play('psoriasis-loop', true);
                break;
            default:
                console.log('Mouse video error');
                break;
            }
        }
    }

    enter() {
        super.enter();

        this.runFromState();
        this.toggleSimulation(this.mousecage.hasMouse());
    }

    exit() {
        this.videoController.stop();
        this.toggleSimulation(false);
        if (this._bloodSugarSubscription) {
            this._bloodSugarSubscription.dispose();
            this._bloodSugarSubscription = null;
        }
    }

    toggleSimulation(enabled) {
        clearInterval(this.simulationIntervalId);
        if (enabled) {
            this.simulationIntervalId = setInterval(this.nextTimeStep,
                                                  this.simulationInterval);
        }
    }

    handleDropOnMouse(item) {
        return DropOnMouseHelper.handleDrop(this, item);
    }

    removeMouse() {
        this.videoController.stop();
        this.toggleSimulation(false);
        this.mousecage.mouse(null);
    }
}

export = MouseCage;
