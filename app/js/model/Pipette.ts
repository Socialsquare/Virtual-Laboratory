import ko = require('knockout');
import _ = require('lodash');
import utils = require('utils/utils');
import CompositeContainerModel = require('model/CompositeContainer');
import ContainerType = require('model/type/Container');


class Pipette extends CompositeContainerModel {

    public active: KnockoutObservable<boolean>;
    public isEmpty: KnockoutComputed<boolean>;

    constructor() {
        super(1, ContainerType.PIPETTE_TIP, ContainerType.PIPETTE);

        this.active = ko.observable(false);

        this.isEmpty = ko.computed(() => {
            if (!this.hasTip())
                return false;

            return this.get(0).isEmpty();
        });
    }

    public hasTip = () => {
        return this.hasContainerAt(0);
    }

    public getTip = () => {
        return this.get(0);
    }

    public removeTip = () => {
        this.remove(0);
    }

    public emptyPipetteInto = (container) => {
        var clonedLiqs = _.invoke(this.getTip().liquids(), 'clone');

        container.addAll(clonedLiqs);
        this.getTip().clearContents();

        // Special case for transfering 24 microtiter-wells at once:
        if (container.type() === ContainerType.MICROTITER && !!this.getTip().microtiterWells()) {

            var clone = this.getTip().microtiterWells().clone();
            //TODO: merge instead of overwriting? Can't decide...
            container.microtiterWells(clone);
        }
    }

    public fillPipette = (container) => {
        // 1st modify the pipette
        var clonedLiqs = _.invoke(container.liquids(), 'clone');
        var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
        this.getTip().addAll(modifiedLiqs);

        // 2nd modify the container
        modifiedLiqs = utils.biology.dilute(50/49, container.liquids());

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
            this.getTip().microtiterWells(container.microtiterWells().clone());
        }

    }
}

export = Pipette;
