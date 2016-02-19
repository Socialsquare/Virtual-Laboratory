import ko = require('knockout');
import _ = require('lodash');

import utils = require('utils/utils');
import popupController = require('controller/Popup');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');

import CompositeContainerModel = require('model/CompositeContainer');
import SimpleContainerModel = require('model/SimpleContainer');
import MicrotiterplateModel = require('model/Microtiterplate');
import TipModel = require('model/Tip');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');

class Pipette extends CompositeContainerModel {

    public active: KnockoutObservable<boolean>;
    public pressTopButton: KnockoutObservable<boolean>;
    public pressSideButton: KnockoutObservable<boolean>;

    constructor() {
        super(1, ContainerType.PIPETTE_TIP, ContainerType.PIPETTE);

        this.active = ko.observable(false);
        this.pressTopButton = ko.observable(false);
        this.pressSideButton = ko.observable(false);

        ko.rebind(this);
    }

    hasTip() {
        return this.hasContainerAt(0);
    }

    hasEmptyTip() {
        if (!this.hasTip())
            return false;
        
        return !this.getTip().liquids()[0];
    }

    hasFilledTip() {
        if (!this.hasTip())
            return false;

        return !this.hasEmptyTip();
    }
    
    hasBloodFilledTip() {
        if (!this.hasTip() || this.hasEmptyTip())
            return false;

        var liquidType = this.getTip().liquids()[0].type();
        var out = liquidType === LiquidType.MOUSE_BLOOD;
        var t1 = LiquidType.MOUSE_BLOOD;
        debugger;
        return liquidType === LiquidType.MOUSE_BLOOD;
    }

    getTip() {
        return <TipModel>this.get(0);
    }

    removeTip() {
        this.pressSideButton(true);
        _.delay(() => { 
            this.pressSideButton(false);
            this.remove(0);
        }, 500);
    }

    newTip() {
        if (this.hasTip())
            return false;

        this.addAt(0, new TipModel());
        return true;
    }

    emptyPipetteInto(container: SimpleContainerModel) {
        var clonedLiqs = _.invoke(this.getTip().liquids(), 'clone');

        container.addAll(clonedLiqs);
        this.getTip().clearContents();
        this.pressTopButton(true);
        _.delay(() => this.pressTopButton(false), 500);

        // Special case for transfering 24 microtiter-wells at once:
        if (container.type() === ContainerType.MICROTITER && !!this.getTip().microtiterWells()) {
            var microtiter = <MicrotiterplateModel>container;
            var clone = this.getTip().microtiterWells().clone();
            //TODO: merge instead of overwriting? Can't decide...
            microtiter.microtiterWells(clone);
        }
    }

    // Fill the pipette from a container. The pipette cannot be filled
    // if the tip has been used in another type of liquid before.
    //
    // Returns a boolean indicating whether the pipette was
    // succesfully filled.
    fillPipette(container: SimpleContainerModel) {
        // Warn user and cancel filling if tip is dirty
        //
        // TODO: check if the current container is equal to the contaminatedBy()
        var contaminator = this.getTip().contaminatedBy();
        if (contaminator) {
            // && contaminator !== container
            var contaminatorTypes = _.map(contaminator.liquids(), (l) => l.type());
            var isSameLiquids = container.containsAllStrict(contaminatorTypes);
    
            if (isSameLiquids && contaminator.contains(LiquidType.FREE_FLOATING_DNA)) {
                // tip contaminated by free floating dna, make sure blood type is the same 
                var ffd = <FreeFloatingDNAModel>contaminator.findByType(LiquidType.FREE_FLOATING_DNA);
                var ffdContainer = <FreeFloatingDNAModel>container.findByType(LiquidType.FREE_FLOATING_DNA);
                isSameLiquids = ffd.bloodType() === ffdContainer.bloodType();
            }

            if (!isSameLiquids) {
                popupController.message('pipette.dirty_tip.header',
                                        'pipette.dirty_tip.body');
                return false;
            }
        }

        // 1st modify the pipette
        var clonedLiqs = _.invoke(container.liquids(), 'clone');
        var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
        this.getTip().addAll(modifiedLiqs);

        // 2nd modify the container
        modifiedLiqs = utils.biology.dilute(50 / 49, container.liquids());

        container.clearContents();

        // prevent trigger because we're not actually adding stuff
        container.addAll(modifiedLiqs, true);

        if (modifiedLiqs.length !== 0) {

            var contaminating = _.any(container.liquids(), (liquid) => {
                return liquid.isContaminating();
            });

            if (contaminating) {
                this.getTip().contaminatedBy(container);
            }
        }

        // Special case for transfering 24 microtiter-wells at once:
        if (container.type() === ContainerType.MICROTITER) {
            var mt = <MicrotiterplateModel>container;
            this.getTip().microtiterWells(mt.microtiterWells().clone());
        }

        // Push top button down to fill up pipette
        this.pressTopButton(true);
        _.delay(() => this.pressTopButton(false), 500);

        return true;
    }
}

export = Pipette;
