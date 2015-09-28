import ko = require('knockout');
import _ = require('lodash');

import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

import BaseViewController = require('controller/view/Base');
import VideoController = require('controller/Video');
import GlucoseBagController = require('controller/GlucoseBag');
import VetMonitorViewController = require('controller/view/VetMonitorViewController');

import BottleModel = require('model/Bottle');
import MouseCage = require('model/MouseCage');

import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

import ContainerFactory = require( 'factory/Container');
import LiquidFactory = require('factory/Liquid');


class MouseCageController extends BaseViewController {

    public videoController: VideoController;
    public vetMonitorViewController: VetMonitorViewController;

    public mousecage: MouseCage;
    public mouseDrinking: KnockoutObservable<boolean>;

    public lowBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public highBloodSugarWarningToggle: KnockoutObservable<boolean>;
    public diabetesDevelopedToggle: KnockoutObservable<boolean>;

    public simulationInterval: number = null;
    public simulationIntervalTime: number = 100;  // millisecond

    public glucoseBagController: GlucoseBagController;
    public bottle: BottleModel;
    private _bloodSugarSubscription = null;

    constructor() {

        super('mousecage');
        
        this.mousecage = this.gameState.mousecage;

        this.videoController = new VideoController(true);
        this.glucoseBagController = new GlucoseBagController(this.mousecage.glucoseBag);

        this.mouseDrinking = ko.observable(false);

        this.lowBloodSugarWarningToggle = ko.observable(false);
        this.highBloodSugarWarningToggle = ko.observable(false);
        this.diabetesDevelopedToggle = ko.observable(false);

        this.bottle = ContainerFactory.bottle().add(LiquidFactory.juice(), true);
        
        ko.rebind(this);
    }
    
    public onBloodSugarChange = (bloodSugar) => {
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
        
        _.map(_.range(1, this.mousecage.glucoseBag.glucoseInfusionRate()), (i) => {
            // this is to increase blood sugar based on Glucose Infusion Rate
            // this is some random number I thought would make sense -
            // every 100ms we add this amount multiplied by the GIR number.
            this.mousecage.mouse().giveGlucose(1 / 60.0);
        });

        this.mousecage.mouse().nextBloodStep();
        this.mousecage.mouse().nextHeartStep();
        
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
        console.log("mousecage exit");
        this.videoController.stop();
        this.toggleSimulation(false);
        if (this._bloodSugarSubscription) {
            this._bloodSugarSubscription.dispose();
            this._bloodSugarSubscription = null;
        }
    }

    toggleSimulation(enabled) {
        if ((enabled) && (this.simulationInterval === null)) {
            this.simulationInterval = setInterval(this.nextTimeStep,
                                                  this.simulationIntervalTime);
        } else if (this.simulationInterval !== null) {
                clearInterval(this.simulationInterval);
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

export = MouseCageController;
