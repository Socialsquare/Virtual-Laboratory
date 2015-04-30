import _ = require('lodash');

import S2T = require('utils/S2T');

import TriggerType = require('model/type/Trigger');
import ActivationType = require('model/type/Activation');
import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import AntibioticType = require('model/type/Antibiotic');
import LocationType = require('model/type/Location');
import AntigenCoatingType = require('model/type/AntigenCoating');

type TriggerLiquid = {
    type: LiquidType,
    subtype?: MicroorganismType | AntibioticType
};

class Trigger {

    public type: TriggerType;
    public item: ContainerType;
    public activation: ActivationType;
    public container: ContainerType;
    public containerSubtype: AntigenCoatingType;
    public location: LocationType;
    public liquids: TriggerLiquid[];
    public strict: boolean;

    constructor(values: any) {
        this.type       = S2T.trigger(values.type);
        this.item       = S2T.container(values.item);
        this.activation = S2T.activation(values.activation);
        this.container  = S2T.container(values.container);
        this.loc        = S2T.loc(values.location);
        this.strict     = values.strict;

        this.liquids = _.map(values.liquids, (l) => {
            var triggerLiquid = { type: S2T.liquid(l.type) };

            if (l.subtype && triggerLiquid.type == LiquidType.MICROORGANISM)
                triggerLiquid.subtype = S2T.microorganism(l.subtype)

            if (l.subtype && triggerLiquid.type == LiquidType.ANTIBIOTIC)
                triggerLiquid.subtype = S2T.antibiotic(l.subtype)

            return triggerLiquid;
        });
    }
}

export = Trigger;
