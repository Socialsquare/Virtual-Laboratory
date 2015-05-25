import ko = require('knockout');
import _ = require('lodash');

import MouseBloodType = require('model/type/MouseBlood');
import MouseType = require('model/type/Mouse');
import LiquidType = require('model/type/Liquid');

import SyringeModel = require('model/Syringe');
import SpleenModel = require('model/Spleen');
import heartRateData = require('json!datadir/heartRate.json');

class Mouse {

    public alive: KnockoutObservable<boolean>;
    public isCut: KnockoutObservable<boolean>;
    // Should be true when an interaction-video is playing.
    public isInteracting: KnockoutObservable<boolean>;
    public spleen: SpleenModel;
    public mouseBloodType: KnockoutObservable<MouseBloodType>;
    public mouseType: KnockoutObservable<MouseType>;
    public heartRateData: any;
    public heartRateIndex: number;


    public bloodData: KnockoutObservableArray<number>;

    public maveSukker: KnockoutObservable<number>;
    public blodSukker: KnockoutObservable<number>;
    public meanBlodSukker: KnockoutObservable<number>;
    public maxBlodSukker: KnockoutObservable<number>;
    public minBlodSukker: KnockoutObservable<number>;
    public killBlodSukker: KnockoutObservable<number>;
    public insulinProduktion: KnockoutObservable<number>;
    public insulinProduktivitet: KnockoutObservable<number>;
    public insulinEffektivitet: KnockoutObservable<number>;
    public juiceDose: KnockoutObservable<number>;
    public insulinDose: KnockoutObservable<number>;

    public description: KnockoutComputed<string>;

    constructor(mouseType, mouseBloodType) {

        this.alive = ko.observable(true);
        this.isCut = ko.observable(false);
        // Indicates whether an interaction-video is playing.
        this.isInteracting = ko.observable(false);
        this.spleen = new SpleenModel();
        this.mouseBloodType = ko.observable(mouseBloodType);
        this.mouseType = ko.observable(mouseType);
        this.heartRateData = heartRateData.xVals;
        this.heartRateIndex = 0;
        this.description = ko.computed(() => {
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
        });

        // BEGIN: Initializing stuff for the bloodsugar simulation
        this.bloodData = ko.observableArray([]);

        this.maveSukker = ko.observable(0);
        this.blodSukker = ko.observable(0);
        this.meanBlodSukker = ko.observable(0);
        this.maxBlodSukker = ko.observable(12);
        this.minBlodSukker = ko.observable(0.5); // The mouse dies if bloodSugar gets below this threshold
        this.killBlodSukker = ko.observable(20); // The mouse dies if bloodSugar gets above this threshold
        this.insulinProduktion = ko.observable(0);
        this.insulinProduktivitet = ko.observable(0);
        this.insulinEffektivitet = ko.observable(0.1);
        this.juiceDose = ko.observable(0);
        this.insulinDose = ko.observable(0);

        this.mouseBloodType.subscribe(function(bloodType){
            this.updateBloodType();
        });

        this.updateBloodType();
        this.blodSukker(this.meanBlodSukker());

        var bloodData = _.map(_.range(0, 250), (i) => this.meanBlodSukker());
        this.bloodData(bloodData);
    }

    // END: Initializing stuff for the bloodsugar simulation


    // Used for determining whether the contents in the syringe is
    // allowed to inject into the mouse GENERALLY. This does NOT take
    // MouseType into consideration.
    public areContentsAllowed = (syringe: SyringeModel) => {
        var allowedInjections = [
            [LiquidType.DEADLY],
            [LiquidType.INSULIN],
            [LiquidType.DESIGNED_DRUG],
            [LiquidType.ADJUVANS, LiquidType.ANTIGEN_SMALLPOX],
            [LiquidType.ADJUVANS, LiquidType.ANTIGEN_GOUT],
            [LiquidType.ANTIBODY_GOUT],
            [LiquidType.ANTIBODY_SMALLPOX]
        ];

        return _.some(allowedInjections, syringe.containsAllStrict);
    }

    public cureDesignedDrug = () => {
        this.mouseType(MouseType.HEALTHY);
    }

    public giveDrug = (designedDrug, administrationForm) => {
        return 'TODO:'; //TODO: implement
    }

    public cure = (antibodyType) => {
        var cured = (this.mouseType() === MouseType.GOUT && antibodyType === LiquidType.ANTIBODY_GOUT)
            || (this.mouseType() === MouseType.SMALLPOX && antibodyType === LiquidType.ANTIBODY_SMALLPOX);

        if (cured) this.mouseType(MouseType.HEALTHY);

        return cured;
    }

    public vaccinate = (antigenType: LiquidType) => {
        if (antigenType === LiquidType.ANTIGEN_GOUT)
            this.spleen.antibodiesFor.push(LiquidType.ANTIBODY_GOUT);
        else
            this.spleen.antibodiesFor.push(LiquidType.ANTIBODY_SMALLPOX);
    }

    // END: Functions for exercise 3: Antibodies

    // BEGIN: Functions for the bloodsugar simulation
    public storeBloodStep = () => {

        var bloodData = this.bloodData();
        var first = bloodData.shift();

        bloodData.push(this.blodSukker());
        this.bloodData(bloodData);
    }

    public hasLethalBloodSugar = () => {
        return this.blodSukker() < this.minBlodSukker() || this.blodSukker() >= this.killBlodSukker();
    }

    public giveJuice = () => {
        this.juiceDose(this.juiceDose() + 3);
    }

    public givInsulin = () => {
        this.insulinDose(this.insulinDose() + 35);
    }

    public nextHeartStep = () =>{
        this.heartRateIndex += 1;

        if (this.heartRateIndex >= this.heartRateData.length) {
            this.heartRateIndex = 0;
        }
    }

    public nextBloodStep = () => {

        //1. kontrolleres om musen er i live
        if(!this.alive()) { return; }

        //3. udregnes sukkeroptag fra mave til blod
        if(this.maveSukker() > 0.0001) {
            var sukkerRatio = this.maveSukker() / this.blodSukker() * 0.2;
            this.maveSukker(this.maveSukker() - sukkerRatio);
            this.blodSukker(this.blodSukker() + sukkerRatio);
        }

        //4. hvis BlodSukker != MeanBlodSukker, foroeg/formindst insulin-niveauet afhaengigt af produktionen
        this.insulinProduktion( (this.blodSukker() - this.meanBlodSukker()) * this.insulinProduktivitet() );

        //4.1 - hvis brugeren har givet musen insulin, foroeg 'insulin-produktion'
        if(this.insulinDose() > 0) {
            var magic = Math.min(this.insulinDose()/3 , 0.6);
            this.insulinProduktion(this.insulinProduktion() + magic*2);
            this.insulinDose(this.insulinDose() - magic);
        }

        if(this.juiceDose() > 0) {
            var magic = Math.min(this.juiceDose()/3, 0.3);
            this.maveSukker(this.maveSukker() + magic*2);
            this.juiceDose(this.juiceDose() - magic);
        }

        //5. fjern blodsukker ved at forbruge insulin.
        this.blodSukker(this.blodSukker() - this.insulinProduktion() * this.insulinEffektivitet());

        this.storeBloodStep();
    }
    // END: Functions for the bloodsugar simulation

    public updateBloodType = () => {
        switch(this.mouseBloodType()) {
        case MouseBloodType.NORMAL:
            this.meanBlodSukker(5);
            this.insulinProduktivitet(1/4.0);
            this.insulinEffektivitet(1/10.0);
            break;
        case MouseBloodType.DIABETIC:
            this.meanBlodSukker(8);
            this.insulinProduktivitet(1/6.0);
            this.insulinEffektivitet(1/15.0);
            break;
        default:
            throw 'Unknown mouseBloodType for the mouse';
        }
    }

    public clone = () => {
        var clone = new Mouse(this.mouseType(), this.mouseBloodType());


        clone.alive(this.alive());
        clone.isCut(this.isCut());
        clone.spleen = this.spleen.clone();

        clone.maveSukker(this.maveSukker());
        clone.blodSukker(this.blodSukker());
        clone.meanBlodSukker(this.meanBlodSukker());
        clone.maxBlodSukker(this.maxBlodSukker());
        clone.minBlodSukker(this.minBlodSukker());
        clone.insulinProduktion(this.insulinProduktion());
        clone.insulinProduktivitet(this.insulinProduktivitet());
        clone.insulinEffektivitet(this.insulinEffektivitet());
        clone.juiceDose(this.juiceDose());
        clone.insulinDose(this.insulinDose());

        clone.bloodData(this.bloodData());

        return clone;
    }
}

export = Mouse;
