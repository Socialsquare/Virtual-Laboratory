define([
    'knockout',
    'base',
    'lodash',
    'model/Spleen',
    'model/type/MouseBlood',
    'model/type/Mouse',
    'model/type/Liquid'
], function (ko, Base, _, SpleenModel, MouseBloodType, MouseType, LiquidType) {

    var Mouse = Base.extend({
        constructor: function (mouseType, mouseBloodType) {
            var self = this;
            //TODO: all the things!

            self.alive = ko.observable(true);
            self.isCut = ko.observable(false);
            self.spleen = new SpleenModel();
            self.mouseBloodType = ko.observable(mouseBloodType);
            self.mouseType = ko.observable(mouseType);
            self.description = ko.computed(function () {
                switch (self.mouseType()) {
                case MouseType.GOUT:
                    return 'mouse.description.gout';

                case MouseType.SMALLPOX:
                    return 'mouse.description.smallpox';

                case MouseType.INSOMNIA:
                    return 'mouse.description.insomnia';

                case MouseType.PSORIASIS:
                    return 'mouse.description.psoriasis';
                }

                switch (self.mouseBloodType()) {
                case MouseBloodType.NORMAL:
                    return 'mouse.description.healthy';

                case MouseBloodType.DIABETIC:
                    return 'mouse.description.diabetic';

                default:
                    return '';
                }
            });

            // BEGIN: Initializing stuff for the bloodsugar simulation
            self.bloodData = ko.observableArray([]);

            self.maveSukker = ko.observable(0);
            self.blodSukker = ko.observable(0);
            self.meanBlodSukker = ko.observable(0);
            self.maxBlodSukker = ko.observable(14);
            self.minBlodSukker = ko.observable(0.5); // The mouse dies if bloodSugar gets below this threshold
            self.insulinProduktion = ko.observable(0);
            self.insulinProduktivitet = ko.observable(0);
            self.insulinEffektivitet = ko.observable(0.1);
            self.juiceDose = ko.observable(0);
            self.insulinDose = ko.observable(0);

            self.setBloodType = function() {


                switch(self.mouseBloodType()) {
                    case MouseBloodType.NORMAL:
                        self.meanBlodSukker(5);
                        self.insulinProduktivitet(1/4.0);
                        self.insulinEffektivitet(1/10.0);
                        break;
                    case MouseBloodType.DIABETIC:
                        self.meanBlodSukker(8);
                        self.insulinProduktivitet(1/10.0);
                        self.insulinEffektivitet(1/20.0);
                        break;
                    default:
                        throw 'Unknown mouseBloodType for the mouse';
                }
            };

            self.setBloodType();
            self.blodSukker(self.meanBlodSukker());

            var bloodData = _.map(_.range(0, 250), function (i) { return self.meanBlodSukker();  });
            self.bloodData(bloodData);

            // END: Initializing stuff for the bloodsugar simulation


            // Used for determining whether the contents in the syringe is allowed to inject into the mouse GENERALLY.
            // This does NOT take MouseType into consideration.
            self.areContentsAllowed = function(syringe) {
                //TODO: allowed contents of the syringe. It shouldn't be allowed to inject random shit.
                var allowedInjections = [[LiquidType.DEADLY], [LiquidType.INSULIN], [LiquidType.DESIGNED_DRUG],
                    [LiquidType.ADJUVANS, LiquidType.ANTIGEN_SMALLPOX], [LiquidType.ADJUVANS, LiquidType.ANTIGEN_GOUT],
                    [LiquidType.ANTIBODY_GOUT], [LiquidType.ANTIBODY_SMALLPOX]
                    ];

                var inputsLength = syringe.liquids().length;

                for(var i = 0; i < allowedInjections.length; i++) {
                    var allowedInjection = allowedInjections[i];
                    var allowedLength = allowedInjection.length;

                    if (inputsLength !== allowedLength)
                        continue;

                    var containsOnlyAllowed = _.every(allowedInjection, function(allowedLiquidType) {
                        return syringe.contains(allowedLiquidType);
                    });

                    if (containsOnlyAllowed)
                        return true;
                }

                return false;
            };

            self.giveDrug = function(designedDrug, administrationForm) {
                return 'TODO:'; //TODO: implement
            };
            /*
             self.action = function (concentration) {
             var liquids = self.washingTank.liquids();
             var result = 0;
             var feedback = '';

             // check if agents contain other stuff
             var indexOfOther = _.findIndex(liquids, function(liquid) {
             return liquid.type() != LiquidType.LIPASE_ENZYME;
             });

             // if found other, bad result
             if (indexOfOther >= 0) {
             result = 0.99;
             feedback = 'washing.detergent_contaminated';

             } else {
             var log = utils.math.getBaseLog(10, concentration);
             if (log > 2) {
             result = 0.01;
             } else {
             result = 1 - log / 2;
             }
             }

             if (result === 0) result = 0.01;
             return { result: result, feedback: feedback };
             };
            */
            // BEGIN: Functions for exercise 3: Antibodies

            self.cure = function(antibodyType) {
                var cured = (self.mouseType() === MouseType.GOUT && antibodyType === LiquidType.ANTIBODY_GOUT)
                        || (self.mouseType() === MouseType.SMALLPOX && antibodyType === LiquidType.ANTIBODY_SMALLPOX);

                if (cured) self.mouseType(MouseType.HEALTHY);

                return cured;
            };

            self.vaccinate = function(antibodyType) {
                self.spleen.antibodiesFor.push(antibodyType);
            };

            // END: Functions for exercise 3: Antibodies


            // BEGIN: Functions for the bloodsugar simulation
            self.storeBloodStep = function() {
                // TODO: use simulation
                var bloodData = self.bloodData();
                var first = bloodData.shift();

                bloodData.push(self.blodSukker());
                self.bloodData(bloodData);
            };

            self.givJuice = function() {
                self.juiceDose(self.juiceDose() + 3);
            };

            self.givInsulin = function() {
                self.insulinDose(self.insulinDose() + 25);
            };

            self.nextBloodStep = function() {

                //1. kontrolleres om musen er i live

                if(self.blodSukker() < self.minBlodSukker()) {
                    self.alive(false);
                    return;
                }

                if(!self.alive()) { return; }

                if(self.mouseBloodType() === MouseBloodType.NORMAL && self.blodSukker() >= self.maxBlodSukker()) {
                    self.setBloodType(MouseBloodType.DIABETIC);
                }

                //3. udregnes sukkeroptag fra mave til blod
                if(self.maveSukker() > 0.0001) {
                    var sukkerRatio = self.maveSukker() / self.blodSukker() * 0.2;
                    self.maveSukker(self.maveSukker() - sukkerRatio);
                    self.blodSukker(self.blodSukker() + sukkerRatio);
                }

                //4. hvis BlodSukker != MeanBlodSukker, foroeg/formindst insulin-niveauet afhaengigt af produktionen
                self.insulinProduktion( (self.blodSukker() - self.meanBlodSukker()) * self.insulinProduktivitet() );

                //4.1 - hvis brugeren har givet musen insulin, foroeg 'insulin-produktion'
                if(self.insulinDose() > 0) {
                    var magic = Math.min(self.insulinDose()/3 , 0.6);
                    self.insulinProduktion(self.insulinProduktion() + magic*2);
                    self.insulinDose(self.insulinDose() - magic);
                }

                if(self.juiceDose() > 0) {
                    var magic = Math.min(self.juiceDose()/3, 0.3);
                    self.maveSukker(self.maveSukker() + magic*2);
                    self.juiceDose(self.juiceDose() - magic);
                }

                //5. fjern blodsukker ved at forbruge insulin.
                self.blodSukker(self.blodSukker() - self.insulinProduktion() * self.insulinEffektivitet());

                self.storeBloodStep();
            };


            // END: Functions for the bloodsugar simulation

            self.clone = function () {
                var clone = new Mouse(self.mouseType(), self.mouseBloodType());


                clone.alive(self.alive());
                clone.isCut(self.isCut);
                clone.spleen = self.spleen.clone();

                clone.maveSukker(self.maveSukker());
                clone.blodSukker(self.blodSukker());
                clone.meanBlodSukker(self.meanBlodSukker());
                clone.maxBlodSukker(self.maxBlodSukker());
                clone.minBlodSukker(self.minBlodSukker());
                clone.insulinProduktion(self.insulinProduktion());
                clone.insulinProduktivitet(self.insulinProduktivitet());
                clone.insulinEffektivitet(self.insulinEffektivitet());
                clone.juiceDose(self.juiceDose());
                clone.insulinDose(self.insulinDose());

                clone.bloodData(self.bloodData());

                return clone;
            };

        }
    });

    return Mouse;
});
