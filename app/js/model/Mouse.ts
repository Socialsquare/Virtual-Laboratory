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
    public meanBloodSugar: KnockoutComputed<number>;
    public heartRate: KnockoutObservable<number>;
    public maxBloodSugar: KnockoutObservable<number>;
    public minBloodSugar: KnockoutObservable<number>;
    public killBloodSugar: KnockoutObservable<number>;
    public insulinProduction: KnockoutObservable<number>;
    public insulinProductivity: KnockoutComputed<number>;
    public insulinEfficiency: KnockoutComputed<number>;
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
        this.bloodSugar = ko.observable(0);
        this.meanBloodSugar = ko.pureComputed(this.computeMeanBloodSugar);
        
        // If blood sugar is above `maxBloodSugar` the mouse gets diabetes
        this.maxBloodSugar = ko.observable(12);
        
        // The mouse dies if bloodSugar gets below this threshold
        this.minBloodSugar = ko.observable(0.5);
        
        // The mouse dies if bloodSugar gets above this threshold
        this.killBloodSugar = ko.observable(20);

        this.insulinProduction = ko.observable(0);
        this.insulinProductivity =
            ko.pureComputed(this.computeInsulinProductivity);
        this.insulinEfficiency =
            ko.pureComputed(this.computeInsulinEfficiency);
        this.glucoseDose = ko.observable(0);
        this.infusionDose = ko.observable(0);
        this.insulinDose = ko.observable(0);

        this.bloodSugar(this.meanBloodSugar());

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
    
    public computeInsulinProductivity = ():number => {
        // FIXME: the further away the blood sugar is from the median
        // the higher insulin production should be.
        
        // FIXME: should the samples be closer to a "normal distribution"?
        
        // healthy mouse has ~0.25
        var healthySamples = [0.23, 0.24, 0.25, 0.25, 0.25, 0.25, 0.26,
            0.26, 0.27, 0.28];
        // diabetic mouse has ~0.166
        var diabeticSamples = [0.148, 0.149, 0.15, 0.15, 0.15, 0.151,
            0.151, 0.152, 0.152, 0.153];
        switch (this.mouseBloodType()) {
            case MouseBloodType.NORMAL:
                return Utils.math.pickRandomValue(healthySamples);
            case MouseBloodType.DIABETIC:
                return Utils.math.pickRandomValue(diabeticSamples);
            default:
                return 0;
        }
    }

    public computeInsulinEfficiency = ():number => {
        switch (this.mouseBloodType()) {
            case MouseBloodType.NORMAL:
                return 1 / 10.0;
            case MouseBloodType.DIABETIC:
                return 1 / 15.0;
            default:
                return 0;
        }
    }

    public computeMeanBloodSugar = ():number => {
        switch (this.mouseBloodType()) {
            case MouseBloodType.NORMAL:
                return Utils.math.pickRandomValue([4.8, 4.9, 4.9, 4.9, 5.0, 5.0, 5.0, 5.0, 5.1, 5.1, 5.2]);
            case MouseBloodType.DIABETIC:
                return Utils.math.pickRandomValue([7.8, 7.9, 8.0, 8.0, 8.0, 8.0, 8.0, 8.1, 8.1, 8.2]);
            default:
                return 0;
        }
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
        this.bloodData(bloodData);
    }

    hasLethalBloodSugar() {
        return ((this.bloodSugar() < this.minBloodSugar()) || (this.bloodSugar() >= this.killBloodSugar()));
    }

    giveJuice() {
        this.glucoseDose(this.glucoseDose() + 3);
    }

    giveInfusion(infusionDose: number): void {
        this.infusionDose(infusionDose);
    }

    giveInsulin() {
        this.insulinDose(this.insulinDose() + 35);
    }
    
    public getMeanHeartRate = () => {
        //var randomHR = Math.floor(Math.random() * 
        //    (this.maxHR - this.minHR) + this.minHR);
        var meanHR = (this.maxHR + this.minHR) / 2;
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

        // increase bloodSugar by infused dose
        // InfusionToBloodMagic for converting from infusion concentration
        // to concentration in blood
        var infusionToBloodMagic = 12;
        this.bloodSugar(this.bloodSugar() +
                        (this.infusionDose() * infusionToBloodMagic));

        //3. f BloodSugar != MeanBloodSugar, increase/decrease insulin levels depending on productivity 
        this.insulinProduction((this.bloodSugar() - this.meanBloodSugar()) * this.insulinProductivity());

        //4. if the user has given the mouse insulin, increase insulin prodction 
        if (this.insulinDose() > 0) {
            var insulinMagic = Math.min(this.insulinDose() / 3 , 0.6);
            this.insulinProduction(this.insulinProduction() + insulinMagic * 2);
            this.insulinDose(this.insulinDose() - insulinMagic);
        }

        if (this.glucoseDose() > 0) {
            var glucoseMagic = Math.min(this.glucoseDose() / 3, 0.3);
            this.stomachSugar(this.stomachSugar() + glucoseMagic * 2);
            this.glucoseDose(this.glucoseDose() - glucoseMagic);
        }

        //5. remove blood sugar by increasing insulin 
        this.bloodSugar(this.bloodSugar() - this.insulinProduction() * this.insulinEfficiency());

        this.storeBloodStep();
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
}

export = Mouse;
