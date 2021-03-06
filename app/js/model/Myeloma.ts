import ko = require('knockout');
import _ = require('lodash');

import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

import MicroorganismModel = require('model/Microorganism');
import SimpleContainerModel = require('model/SimpleContainer');
import MicrotiterplateModel = require('model/Microtiterplate');

import lh = require('utils/LiquidHelper');

class Myeloma extends MicroorganismModel {

    public antibodiesFor: KnockoutObservableArray<LiquidType>;
    public isHybridoma: KnockoutObservable<boolean>;

    public hasSetAntibodiesInThese: KnockoutObservableArray<SimpleContainerModel>;

    constructor() {
        super(MicroorganismType.MYELOMA);

        this.antibodiesFor = ko.observableArray([]);
        this.isHybridoma = ko.observable(false);
        this.hasSetAntibodiesInThese = ko.observableArray([]);
        this.living(true);
        this.extraGenes([]);
        this.extraProperties([]);
        this.optimalPh(7.25); // http://en.wikipedia.org/wiki/Blood#Narrow_range_of_pH_values
        this.optimalTemp(37);
        this.concentration(Math.pow(10, 8));

        ko.rebind(this);
    }

    react(container: SimpleContainerModel) {
        var containsHybridomaMedium;
        var containsHomoSpleen = false;

        //if (container.location() !== LocationType.SPECTROPM)
        //    return;

        // Figure out whether it contains homospleen (and other stuff)
        var homospleens = lh.homospleens(container.liquids());
        _.each(homospleens, (homospleen) => {

            if (homospleen.antibodiesFor().length > 0) //TODO: perhaps always set this, if it is mixed with homoSpleen?
                containsHomoSpleen = true;

            // Add antibodies it doesn't already contain.
            _.each(homospleen.antibodiesFor(), (antibodyType) => {
                if (!_.contains(this.antibodiesFor(), antibodyType)) {
                    this.antibodiesFor.push(antibodyType);
                }
            });
        });

        containsHybridomaMedium = _.any(container.liquids(), (liquid) => {
            return liquid.type() === LiquidType.HYBRIDOMA_MEDIUM;
        });


        // Sets .isHybridoma if the conditions are right
        if (containsHomoSpleen && containsHybridomaMedium) {
            this.isHybridoma(true);
        }

        //if container.type() === microtiter && myeloma.isHybridoma() --> modify random Well.
        if ((container.type() === ContainerType.MICROTITER) && this.isHybridoma()) {
            var microtiter = <MicrotiterplateModel>container;

            var hasAlreadySetAntibodies = _.any(this.hasSetAntibodiesInThese(), (_microtiter) => {
                return _microtiter === microtiter;
            });

            var indices = _.range(24);

            if (!hasAlreadySetAntibodies) {
                //Set well--> contains
                _.each(indices, (index) => {
                    microtiter.microtiterWells().wells()[index].hasAntibody(true);
                    microtiter.microtiterWells.valueHasMutated();
                });

                this.hasSetAntibodiesInThese.push(microtiter);
            }
        }
    }

    clone() {
        var clone = new Myeloma();

        clone.hasReacted(this.hasReacted());
        clone.antibodiesFor(this.antibodiesFor());
        clone.hasSetAntibodiesInThese(this.hasSetAntibodiesInThese());
        clone.living(this.living());
        clone.name(this.name());
        clone.extraGenes(_.invoke(this.extraGenes(), 'clone'));
        clone.extraProperties(_.invoke(this.extraProperties(), 'clone'));
        clone.optimalPh(this.optimalPh());
        clone.optimalTemp(this.optimalTemp());
        clone.concentration(this.concentration());
        clone.producedEnzymes(_.invoke(this.producedEnzymes(), 'clone'));

        return clone;
    }
}

export = Myeloma;
