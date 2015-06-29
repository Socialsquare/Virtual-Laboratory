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
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

type TriggerLiquid = {
    type: LiquidType;
    subtype?: MicroorganismType | AntibioticType;
};

type TriggerContainers = {
    type: ContainerType;
    liquids: TriggerLiquid[];
    containerSubtype: AntigenCoatingType;
}[];

type ActivationSubType = {
    liquidType: LiquidType;
    maxIc50: number;
};

class Trigger {

    public type: TriggerType;
    public item: ContainerType;
    public activation: ActivationType;
    public activationSubtype: ActivationSubType;
    public container: ContainerType;
    public containers: TriggerContainers;
    public containerSubtype: AntigenCoatingType;
    public location: LocationType;
    public liquids: TriggerLiquid[];
    public strict: boolean;
    public concentration: number;
    public liquidsOrdered: boolean;

    // Mouse trigger
    public alive: boolean;
    public mouseType: MouseType;
    public mouseBloodType: MouseBloodType;

    constructor(values: any) {
        this.type              = S2T.trigger(values.type);
        this.item              = S2T.container(values.item);
        this.activation        = S2T.activation(values.activation);
        this.container         = S2T.container(values.container);
        this.containerSubtype  = S2T.antigenCoating(values.containerSubtype);
        this.location          = S2T.loc(values.location);
        this.strict            = values.strict;
        this.concentration     = values.concentration;
        this.liquidsOrdered    = values.liquidsOrdered;

        this.alive             = values.alive;
        this.mouseType         = S2T.mouse(values.mouseType);
        this.mouseBloodType    = S2T.mouseBlood(values.mouseBloodType);

        if (values.containers) {
            this.containers = _.map(values.containers, (c: any) => {
                return {
                    type: S2T.container(c.type),
                    containerSubtype: S2T.antigenCoating(c.containerSubtype),
                    liquids: this.parseLiquids(c.liquids)
                };
            });
        }

        if (values.activationSubtype) {
            this.activationSubtype = {
                liquidType: S2T.liquid(values.activationSubtype.liquidType),
                maxIc50: values.activationSubtype.maxIc50
            };
        }

        this.liquids = this.parseLiquids(values.liquids);
    }

    parseLiquids(raw: any) {
        return _.map(raw, (l: any) => {
            var triggerLiquid: TriggerLiquid = { type: S2T.liquid(l.type) };

            if (l.subtype && triggerLiquid.type === LiquidType.MICROORGANISM)
                triggerLiquid.subtype = S2T.microorganism(l.subtype);

            if (l.subtype && triggerLiquid.type === LiquidType.ANTIBIOTIC)
                triggerLiquid.subtype = S2T.antibiotic(l.subtype);

            return triggerLiquid;
        });
    }
}

export = Trigger;
