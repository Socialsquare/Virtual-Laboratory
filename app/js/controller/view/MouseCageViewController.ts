import ko = require('knockout');
import _ = require('lodash');

import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');
import GlucoseBagController = require('controller/GlucoseBag');
import VetMonitorController = require('controller/VetMonitorController');

import BottleModel = require('model/Bottle');
import MouseCage = require('model/MouseCage');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

import ContainerFactory = require( 'factory/Container');
import LiquidFactory = require('factory/Liquid');


class MouseCageViewController extends BaseViewController {

    public videoController: VideoController;
    public vetMonitorController: VetMonitorController;

    public mousecage: MouseCage;
    public mouseDrinking: KnockoutObservable<boolean>;

    public lowBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public highBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public diabetesDevelopedToggle: KnockoutObservable<boolean>;

    public simulationInterval: KnockoutObservable<number>;
    public simulationIntervalTime: number = 100;  // millisecond

    public glucoseBagController: GlucoseBagController;
    public bottle: BottleModel;

    constructor() {

        super('mousecage');

        this.videoController = new VideoController(true);
        this.vetMonitorController = new VetMonitorController();

        this.mousecage = this.gameState.mousecage;
        this.mouseDrinking = ko.observable(false);

        this.lowBloodSugarWarningToggle = ko.observable(false);
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);

        if (this.mousecage.hasMouse()) {
            this.mousecage.mouse().bloodSugar.subscribe(this.bloodSugarSubscription);
        }

        this.simulationInterval = ko.observable(null);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);

        this.glucoseBagController = new GlucoseBagController(this.mousecage.glucoseBag);

        if (this.mousecage.hasMouse()) this.vetMonitorController.updatePlotData();

        ko.rebind(this);
    }
    
    public bloodSugarSubscription = (bloodSugar) => {
        if (bloodSugar < 1.5 && !this.lowBloodSugarWarningToggle()) {
            this.lowBloodSugarWarningToggle(true);
            this.popupController.message('mouse.warning_insulin.header', 'mouse.warning_insulin.body');
        } else if (bloodSugar > this.mousecage.mouse().maxBloodSugar() * 0.8
                 && !this.highBloodSugarWarningToggle()
                 && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
            this.highBloodSugarWarningToggle(true);
            this.popupController.message('mouse.warning_diabetes_risk.header', 'mouse.warning_diabetes_risk.body');
        } else if (bloodSugar >= this.mousecage.mouse().maxBloodSugar()
                 && !this.diabetesDevelopedToggle()
                 && this.mousecage.mouse().mouseBloodType() === MouseBloodType.NORMAL) {
            this.diabetesDevelopedToggle(true);
            this.popupController.message('mouse.warning_diabetes.header', 'mouse.warning_diabetes.body');
            this.mousecage.mouse().mouseBloodType(MouseBloodType.DIABETIC);
        }
    }

    nextTimeStep() {
        if (!this.mousecage.hasMouse()) return;

        this.mousecage.mouse().nextBloodStep();
        this.mousecage.mouse().nextHeartStep();
        
        this.vetMonitorController.storeGlucoseStep(this.glucoseBagController.glucoseBag.glucoseInfusionRate())
        
        if (this.mousecage.mouse().hasLethalBloodSugar()) {
            this.toggleSimulation(false);

            this.videoController.play('fast-die-insulin', false).then(() => {
                this.mousecage.mouse().alive(false);
                this.mouseDrinking(false);
                this.popupController.message('mouse.died_glucose.header', 'mouse.died_glucose.body');
            });
        }

        if (this.mousecage.hasMouse())
            this.vetMonitorController.updatePlotData();
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
    }

    toggleSimulation(enabled) {
        if (enabled) {
            this.simulationInterval(setInterval(this.nextTimeStep, this.simulationIntervalTime));
        } else {
            clearInterval(this.simulationInterval());
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

export = MouseCageViewController;
