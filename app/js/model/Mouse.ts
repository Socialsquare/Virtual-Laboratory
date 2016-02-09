import ko = require('knockout');
import _ = require('lodash');

import MouseBloodType = require('model/type/MouseBlood');
import MouseType = require('model/type/Mouse');
import LiquidType = require('model/type/Liquid');

import SimpleContainerModel = require('model/SimpleContainer');
import SpleenModel = require('model/Spleen');
import heartRateData = require('json!datadir/heartRate.json');

import SpecialItemModel = require('model/SpecialItem');
import SpecialItemType = require('model/type/SpecialItem');
import Utils = require('utils/utils');


class Mouse extends SpecialItemModel {
    
    public minHR: number = 650;
    public maxHR: number = 700;
    public heartRateData: any;
    public heartRateIndex: number;
    public spleen: SpleenModel;

    public mouseType: KnockoutObservable<MouseType>;
    public bloodData: KnockoutObservableArray<number>;
    public mouseBloodType: KnockoutObservable<MouseBloodType>;
    public bloodSugar: KnockoutObservable<number>;
    public stomachSugar: KnockoutObservable<number>;
    public meanBloodSugar: KnockoutObservable<number>;
    public heartRate: KnockoutObservable<number>;
    public maxBloodSugar: KnockoutObservable<number>;
    public minBloodSugar: KnockoutObservable<number>;
    public killBloodSugar: KnockoutObservable<number>;
    public insulinProduction: KnockoutObservable<number>;
    public insulinProductivity: KnockoutObservable<number>;
    public insulinEfficiency: KnockoutObservable<number>;
    public glucoseDose: KnockoutObservable<number>;
    private infusionDose: KnockoutObservable<number>;
    public insulinDose: KnockoutObservable<number>;
    public description: KnockoutComputed<string>;
    public isCut: KnockoutObservable<boolean>;
    public alive: KnockoutObservable<boolean>;
    public isInteracting: KnockoutObservable<boolean>;

    constructor(mouseType, mouseBloodType) {

        super(SpecialItemType.MOUSE);

        if (-1 === $.inArray(mouseBloodType,
                [MouseBloodType.NORMAL, MouseBloodType.DIABETIC])) {
            throw 'Unknown mouseBloodType for the mouse';
        }

        this.alive = ko.observable(true);
        this.isCut = ko.observable(false);
        // Indicates whether an interaction-video is playing.
        this.isInteracting = ko.observable(false);
        this.spleen = new SpleenModel();
        this.mouseBloodType = ko.observable(mouseBloodType);
        this.mouseType = ko.observable(mouseType);

        this.heartRateData = heartRateData.xVals;
        this.heartRateIndex = 0;
        this.heartRate = ko.observable(this.getMeanHeartRate());

        this.description = ko.pureComputed(this.computeDescription);

        this.bloodData = ko.observableArray([]);

        this.stomachSugar = ko.observable(0);
        this.meanBloodSugar = ko.observable(this.computeMeanBloodSugar(mouseBloodType));
        this.bloodSugar = ko.observable(this.meanBloodSugar());
        
        // If blood sugar is above `maxBloodSugar` the mouse gets diabetes
        this.maxBloodSugar = ko.observable(12);
        
        // The mouse dies if bloodSugar gets below this threshold
        this.minBloodSugar = ko.observable(0.5);
        
        // The mouse dies if bloodSugar gets above this threshold
        this.killBloodSugar = ko.observable(20);

        this.insulinProduction = ko.observable(0);
        this.insulinProductivity = ko.observable(this.computeInsulinProductivity(this.mouseBloodType()));
        this.insulinEfficiency = ko.observable(this.computeInsulinEfficiency(this.mouseBloodType()));
        this.mouseBloodType.subscribe((newVal)=>{
            this.insulinEfficiency(this.computeInsulinEfficiency(this.mouseBloodType()));
            this.meanBloodSugar(this.computeMeanBloodSugar(this.mouseBloodType()));
            this.insulinProductivity(this.computeInsulinProductivity(this.mouseBloodType()));
        });
        this.glucoseDose = ko.observable(0);
        this.infusionDose = ko.observable(null);
        this.insulinDose = ko.observable(0);


        var bloodData = _.map(_.range(0, 250), (i) => null);
        this.bloodData(bloodData);

        ko.rebind(this);
    }
    
    public computeDescription = ():string => {
        switch (this.mouseType()) {
            case MouseType.GOUT:
                return 'mouse.description.gout';
    
            case MouseType.SMALLPOX:
                return 'mouse.description.smallpox';
    
            case MouseType.INSOMNIA:
                return 'mouse.description.insomnia';
    
            case MouseType.PSORIASIS:
                return 'mouse.description.psoriasis';
            }
    
            switch (this.mouseBloodType()) {
            case MouseBloodType.NORMAL:
                return 'mouse.description.healthy';
    
            case MouseBloodType.DIABETIC:
                return 'mouse.description.diabetic';
    
            default:
                return '';
        }
    }
    
    public computeInsulinProductivity = (mouseBloodType: number):number => {
        // FIXME: the further away the blood sugar is from the median
        // the higher insulin production should be.
        
        // FIXME: should the samples be closer to a "normal distribution"?
        
        // healthy mouse has ~0.25
        var healthySamples = [0.23, 0.24, 0.25, 0.25, 0.25, 0.25, 0.26,
            0.26, 0.27, 0.28];
        // diabetic mouse has ~0.166
        var diabeticSamples = [0.148, 0.149, 0.15, 0.15, 0.15, 0.151,
            0.151, 0.152, 0.152, 0.153];
        var ret: number;
        if  (mouseBloodType === MouseBloodType.NORMAL) {
            ret = Utils.math.pickRandomValue(healthySamples);
        } else if (mouseBloodType === MouseBloodType.DIABETIC) {
            ret = Utils.math.pickRandomValue(diabeticSamples);
        } else {
            ret = 0;
        }
        return ret;
    }

    public computeInsulinEfficiency = (mouseBloodType: number):number => {
        var ret: number;
        if  (mouseBloodType === MouseBloodType.NORMAL) {
            ret = 1 / 10.0;
        } else if (mouseBloodType === MouseBloodType.DIABETIC) {
            ret = 1 / 15.0;
        } else {
            ret = 0;
        }
        return ret;
    }

    public computeMeanBloodSugar = (mouseBloodType: number):number => {
        var ret: number;
        if (mouseBloodType === MouseBloodType.NORMAL) {
            ret = Utils.math.pickRandomValue([4.8, 4.9, 4.9, 4.9, 5.0, 5.0, 5.0, 5.0, 5.1, 5.1, 5.2]);
        } else if (mouseBloodType === MouseBloodType.DIABETIC) {
            ret = Utils.math.pickRandomValue([10.8, 10.9, 11.0, 11.0, 11.0, 11.0, 11.0, 11.1, 11.1, 11.2]);
        } else {
            ret = 0;
        }
        return ret;
    }

    // Used for determining whether the contents in the syringe is
    // allowed to inject into the mouse GENERALLY. This does NOT take
    // MouseType into consideration.
    areContentsAllowed(container: SimpleContainerModel) {
        var allowedInjections = [
            [LiquidType.DEADLY],
            [LiquidType.INSULIN],
            [LiquidType.DESIGNED_DRUG],
            [LiquidType.ADJUVANS, LiquidType.ANTIGEN_SMALLPOX],
            [LiquidType.ADJUVANS, LiquidType.ANTIGEN_GOUT],
            [LiquidType.ANTIBODY_GOUT],
            [LiquidType.ANTIBODY_SMALLPOX]
        ];

        return _.some(allowedInjections, container.containsAllStrict);
    }

    cureDesignedDrug() {
        this.mouseType(MouseType.HEALTHY);
    }

    giveDrug(designedDrug, administrationForm) {
        return 'TODO:'; //TODO: implement
    }

    cure(antibodyType) {
        var cured = (this.mouseType() === MouseType.GOUT && antibodyType === LiquidType.ANTIBODY_GOUT)
            || (this.mouseType() === MouseType.SMALLPOX && antibodyType === LiquidType.ANTIBODY_SMALLPOX);

        if (cured) this.mouseType(MouseType.HEALTHY);

        return cured;
    }

    vaccinate(antigenType: LiquidType) {
        if (antigenType === LiquidType.ANTIGEN_GOUT)
            this.spleen.antibodiesFor.push(LiquidType.ANTIBODY_GOUT);
        else
            this.spleen.antibodiesFor.push(LiquidType.ANTIBODY_SMALLPOX);
    }

    // END: Functions for exercise 3: Antibodies

    // BEGIN: Functions for the bloodsugar simulation
    storeBloodStep() {

        var bloodData = this.bloodData();
        bloodData.shift();

        bloodData.push(this.bloodSugar());
        this.bloodData.removeAll();
        this.bloodData(bloodData);
    }

    hasLethalLowBloodSugar() {
        return (this.bloodSugar() < this.minBloodSugar());
    }

    hasLethalHighBloodSugar() {
        return (this.bloodSugar() >= this.killBloodSugar());
    }

    hasLethalBloodSugar() {
        return this.hasLethalLowBloodSugar() || this.hasLethalHighBloodSugar();
    }

    giveJuice() {
        this.glucoseDose(this.glucoseDose() + 3);
    }

    giveInfusion(infusionDose: number): void {
        this.infusionDose(infusionDose);
    }
    
    resetInfusion(): void {
        this.infusionDose(null);
    }
    
    resetBloodSugar(){
        this.bloodSugar(this.meanBloodSugar());
    }

    giveInsulin() {
        this.insulinDose(this.insulinDose() + 35);
    }
    
    public getMeanHeartRate = () => {
        //var randomHR = Math.floor(Math.random() * 
        //    (this.maxHR - this.minHR) + this.minHR);
        var meanHR = (this.maxHR + this.minHR) / 2;
        if (this.mouseBloodType() === MouseBloodType.DIABETIC) {
            meanHR += 10;
        }
        return meanHR;
    }
    
    nextHeartStep() {
        this.heartRateIndex += 1;
        if (this.heartRateIndex >= this.heartRateData.length) {
            this.heartRateIndex = 0;
        }
    }

    nextBloodStep() {
        //1. check whether mouse is alive
        if (!this.alive())
            return;

        //2. calculate sugar intake from stomach to blood
        if (this.stomachSugar() > 0.0001) {
            var sukkerRatio = this.stomachSugar() / this.bloodSugar() * 0.2;
            this.stomachSugar(this.stomachSugar() - sukkerRatio);
            this.bloodSugar(this.bloodSugar() + sukkerRatio);
        }

        if (this.infusionDose() !== null) {
            // increase bloodSugar by infused dose of glucose
            // converting from infusion concentration to concentration in blood
            // CLAMP (1c) experiment only
            var infusionStadyBase = 0.43;
            var magicToSpeedThingsUp = 200; // time in game is faster than the real live time
            if (this.mouseBloodType() === MouseBloodType.DIABETIC) {
                infusionStadyBase = 0.18;
                magicToSpeedThingsUp = 600;
            }
            var infusionStadyState = (infusionStadyBase / (60 * 1000)) * 100;  // per 100ms
            if (this.bloodSugar() <= 0){
                // this should not have happened right? ;-)
                if (this.alive()) {
                    this.alive(false);
                }
                return;
            }
            var glucoseDelta = (- (1.2 * (infusionStadyState - this.infusionDose()) ) / this.bloodSugar());
            glucoseDelta = glucoseDelta * magicToSpeedThingsUp;
            this.bloodSugar(this.bloodSugar() + glucoseDelta);

            // 3 & 4
            this.insulinNextStep();
        } else {
            // This is glucose handling in every experiment except CLAMP.

            // 3 & 4
            this.insulinNextStep();

            if (this.glucoseDose() > 0) {
                var glucoseMagic = Math.min(this.glucoseDose() / 3, 0.3);
                this.stomachSugar(this.stomachSugar() + glucoseMagic * 2);
                this.glucoseDose(this.glucoseDose() - glucoseMagic);
            }
    
            //5. remove blood sugar by increasing insulin
            this.bloodSugar(this.bloodSugar() - this.insulinProduction() * this.insulinEfficiency());
        }
        this.storeBloodStep();
    }
    
    insulinNextStep() {
        //3. f BloodSugar != MeanBloodSugar, increase/decrease insulin levels depending on productivity 
        var prod: number = (this.bloodSugar() - this.meanBloodSugar()) * this.insulinProductivity();
        this.insulinProduction(prod);
        //4. if the user has given the mouse insulin, increase insulin prodction 
        if (this.insulinDose() > 0) {
            var insulinMagic = Math.min(this.insulinDose() / 3 , 0.6);
            this.insulinProduction(this.insulinProduction() + insulinMagic * 2);
            this.insulinDose(this.insulinDose() - insulinMagic);
        }
    }

    clone() {
        var clone = new Mouse(this.mouseType(), this.mouseBloodType());

        clone.alive(this.alive());
        clone.isCut(this.isCut());
        clone.spleen = this.spleen.clone();

        clone.stomachSugar(this.stomachSugar());
        clone.bloodSugar(this.bloodSugar());
        clone.maxBloodSugar(this.maxBloodSugar());
        clone.minBloodSugar(this.minBloodSugar());
        clone.insulinProduction(this.insulinProduction());
        clone.glucoseDose(this.glucoseDose());
        clone.insulinDose(this.insulinDose());

        clone.bloodData(this.bloodData());
        return clone;
    }
    
    dispose() {
    }
}

export = Mouse;
