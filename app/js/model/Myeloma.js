define([
    'knockout',
    'lodash',
    'model/Microorganism',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/type/Microorganism',
    'model/type/Container',
    'model/type/Location'
], function(ko, _, MicroorganismModel, LiquidType, ReactionCount, MicroorganismType, ContainerType, LocationType) {

    var Myeloma = MicroorganismModel.extend({
        constructor: function () {

            var self = this;
            self.base(MicroorganismType.MYELOMA);
            self.antibodiesFor = ko.observableArray([]);
            self.isHybridoma = ko.observable(false);

            self.hasSetAntibodiesInThese = ko.observableArray([]);


            self.living(true);
            self.extraGenes([]);
            self.extraProperties([]);
            self.optimalPh(7.25); // http://en.wikipedia.org/wiki/Blood#Narrow_range_of_pH_values
            self.optimalTemp(37);
            self.concentration(Math.pow(10, 8));



            self.react = function (container) {
                var containsHybridomaMedium;
                var containsHomoSpleen = false;

                if(container.location() !== LocationType.SPECTROPM)
                    return;

                // Figure out whether it contains homospleen (and other stuff)
                _.each(container.liquids(), function(liquid) {


                    if (liquid.type() === LiquidType.HOMO_SPLEEN) {
                        if (liquid.antibodiesFor().length > 0) //TODO: perhaps always set this, if it is mixed with homoSpleen?
                            containsHomoSpleen = true;

// Add antibodies it doesn't already contain.
                        _.each(liquid.antibodiesFor(), function(antibodyType) {
                            if (!_.contains(self.antibodiesFor(), antibodyType)) {
                                self.antibodiesFor.push(antibodyType);
                            }
                        });
                    }
                });

                containsHybridomaMedium = _.any(container.liquids(), function(liquid) {
                    return liquid.type() === LiquidType.HYBRIDOMA_MEDIUM;
                });


// Sets .isHybridoma if the conditions are right
                if (containsHomoSpleen && containsHybridomaMedium) {
                    self.isHybridoma(true);
                }

                //if container.type() === microtiter && myeloma.isHybridoma() --> modify random Well.
                if (container.type() === ContainerType.MICROTITER && self.isHybridoma()) {

                    var hasAlreadySetAntibodies = _.any(self.hasSetAntibodiesInThese(), function(microtiter) {
                        return microtiter === container;
                    });

                    var totalConcentration = container.getTotalConcentration();
                    var wellModificationCounter = 0;

                    while(totalConcentration > 0 && wellModificationCounter < 24) {
                        totalConcentration -= 50; //24 * 2;//TODO: magic number corresponding to the concentration needed for having a single cell in a well. iiish
                        wellModificationCounter++;
                    }

                    var indices = _.range(24);
                    indices = _.sample(indices, wellModificationCounter);

                    if (! hasAlreadySetAntibodies) {
                        //Set well--> contains
                        _.each(indices, function(index) {
                            container.microtiterWells().wells()[index].hasAntibody(true);
                            console.log('TODO: GREAT SUCCES! the well now contains antibodies!');
                        });

                        self.hasSetAntibodiesInThese.push(container);
                    }
                }
            };

            self.clone = function () {
                var clone = new Myeloma();

                clone.hasReacted(self.hasReacted());

                clone.antibodiesFor(self.antibodiesFor());
                clone.hasSetAntibodiesInThese(self.hasSetAntibodiesInThese());

                clone.living(self.living());
                clone.name(self.name());
                clone.extraGenes(_.invoke(self.extraGenes(), 'clone'));
                clone.extraProperties(_.invoke(self.extraProperties(), 'clone'));
                clone.optimalPh(self.optimalPh());
                clone.optimalTemp(self.optimalTemp());
                clone.concentration(self.concentration());
                clone.producedEnzymes(_.invoke(self.producedEnzymes(), 'clone'));

                return clone;
            };
        }
    });

    return Myeloma;
});

