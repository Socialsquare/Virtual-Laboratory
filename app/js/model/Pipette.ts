import ko = require('knockout');
import _ = require('lodash');

import utils = require('utils/utils');
import popupController = require('controller/Popup');

import ContainerType = require('model/type/Container');

import CompositeContainerModel = require('model/CompositeContainer');
import SimpleContainerModel = require('model/SimpleContainer');
import MicrotiterplateModel = require('model/Microtiterplate');
import TipModel = require('model/Tip');

class Pipette extends CompositeContainerModel {

    public active: KnockoutObservable<boolean>;
    public isEmpty: KnockoutComputed<boolean>;

    constructor() {
        super(1, ContainerType.PIPETTE_TIP, ContainerType.PIPETTE);

        this.active = ko.observable(false);

        this.isEmpty = ko.pureComputed(() => {
            if (!this.hasTip())
                return false;

            return this.get(0).isEmpty();
        });

        ko.rebind(this);
    }

    hasTip() {
        return this.hasContainerAt(0);
    }

    getTip() {
        return <TipModel>this.get(0);
    }

    removeTip() {
        this.remove(0);
    }

    emptyPipetteInto(container: SimpleContainerModel) {
        var clonedLiqs = _.invoke(this.getTip().liquids(), 'clone');

        container.addAll(clonedLiqs);
        this.getTip().clearContents();

        // Special case for transfering 24 microtiter-wells at once:
        if (container.type() === ContainerType.MICROTITER && !!this.getTip().microtiterWells()) {
            var microtiter = <MicrotiterplateModel>container;
            var clone = this.getTip().microtiterWells().clone();
            //TODO: merge instead of overwriting? Can't decide...
            microtiter.microtiterWells(clone);
        }
    }

    fillPipette(container: SimpleContainerModel) {
        // Warn user and cancel filling if tip is dirty
        //
        // TODO: check if the current container is equal to the contaminatedBy()
        var contaminator = this.getTip().contaminatedBy();
        if (contaminator && contaminator !== container) {
            popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
            return;
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

        // TODO: this might not be needed when graphics for the pipette are implemented
        popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
    }
}

export = Pipette;
