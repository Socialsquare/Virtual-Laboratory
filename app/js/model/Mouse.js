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
            self.mouseBloodType = ko.observable(null);
            self.mouseType = ko.observable(mouseType);
            self.description = ko.computed(function () {
                switch (self.mouseType()) {
                case MouseType.GOUT:
                    return 'mouse.description.gout';

                case MouseType.SMALLPOX:
                    return 'mouse.description.smallpox';

                case MouseType.INSOMNIA:
                    return 'mouse.description.insomnia';
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

            self.bloodData = ko.observableArray([]);

            // BEGIN: Initializing stuff for the bloodsugar simulation
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

            self.setBloodType = function(mouseBloodType) {
                self.mouseBloodType(mouseBloodType);

                switch(mouseBloodType) {
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

            self.setBloodType(mouseBloodType);
            self.blodSukker(self.meanBlodSukker());

            var bloodData = _.map(_.range(0, 250), function (i) { return self.meanBlodSukker();  });
            self.bloodData(bloodData);

            // END: Initializing stuff for the bloodsugar simulation


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


        }
    });

    return Mouse;
});
