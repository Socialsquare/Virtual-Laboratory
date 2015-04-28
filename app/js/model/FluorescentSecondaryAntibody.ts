import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import LiquidType = require('model/type/Liquid');
import ContainerType = require('model/type/Container');
import ReactionCount = require('model/ReactionCount');


class FlourescentSecondaryAntibody extends LiquidModel {
    constructor() {
        super(LiquidType.FLUORESCENT_2ND_ANTIBODY, ReactionCount.ALWAYS, true);
    }

    public react = (container) => {
        if (container.type() === ContainerType.MICROTITER) {
            container.microtiterWells().addFluorescentSecondaryAntibodies();
        }
    }

    public clone = () => {
        var clone = new FlourescentSecondaryAntibody();

        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = FlourescentSecondaryAntibody;
