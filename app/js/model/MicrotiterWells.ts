import ko = require('knockout');
import _ = require('lodash');

import LiquidType = require('model/type/Liquid');

import ReactionCount = require('model/ReactionCount');
import LiquidModel = require('model/Liquid');
import WellModel = require('model/Well');

// It's a liquid so it can be contained in a microtiterplate. And it's
// shitty hack...
class MicrotiterWells extends LiquidModel {

    public wells: KnockoutObservableArray<WellModel>;

    //TODO: antigenCoatingType ?
    constructor() {
        super(LiquidType.MICROTITER_WELLS, ReactionCount.NEVER, false);

        this.wells = ko.observableArray([]);

        for (var i = 0; i < 24; i++) {
            this.wells.push(new WellModel());
        }
    }

    public isWellFluorescent = (index) => {
        return this.wells()[index].hasFluorescentSecondaryAntibody();
    }

    public clone = () => {
        var clone = new MicrotiterWells();
        clone.wells(_.invoke(this.wells(), 'clone'));

        return clone;
    }

    public addFluorescentSecondaryAntibodies = () => {
        _.each(this.wells(), (well) => {
            well.hasFluorescentSecondaryAntibody(true);
        });
    }

    public clearWellsAntibodies = () => {
        _.each(this.wells(), (well) => {
            well.hasAntibody(false);
        });
    }

    public clearWellsSecondaryAntibodies = (checkForAntibodies) => {
        _.each(this.wells(), (well) => {
            if (checkForAntibodies) {
                if (!well.hasAntibody()) {
                    well.hasFluorescentSecondaryAntibody(false);
                }
            } else {
                well.hasFluorescentSecondaryAntibody(false);
            }
        });

    }}

export = MicrotiterWells;
