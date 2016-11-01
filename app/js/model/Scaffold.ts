/* tslint:disable: align */
import ko = require('knockout');
import _ = require('lodash');

import LiquidType = require('model/type/Liquid');

import ReactionCount = require('model/ReactionCount');
import LiquidModel = require('model/Liquid');
import SidegroupSlotModel = require('model/SidegroupSlot');


class Scaffold extends LiquidModel {

    public name: string;
    public id: any;
    public offset: any;
    public drugInfo: any;
    // used for simple cloning
    public initialValues: any;
    public hasReacted: any;

    public slots: KnockoutObservableArray<SidegroupSlotModel>;
    public configurationString: KnockoutComputed<string>;
    public file: KnockoutComputed<string>;

    constructor(values) {
        super(LiquidType.DESIGNED_DRUG, ReactionCount.NEVER, false);

        this.name = values.name;
        this.id = values.id;
        this.offset = values.offset;
        this.drugInfo = {};
        this.initialValues = values;

        var slots = _.map(values.slots, (sidegroupSlot) => {
            return new SidegroupSlotModel(sidegroupSlot);
        });

        this.slots = ko.observableArray(slots);

        this.configurationString = ko.pureComputed(() => {
            var sidegroups = _(this.slots())
                .sortBy((slot) => slot.index)
                .map((slot) => {
                    return slot.sidegroup() ? slot.sidegroup().id : 'R';
                });

            return this.id + '_' + sidegroups.join('_');
        });

        this.file = ko.pureComputed(() => {
            return 'assets/svgs/scaffold_' + this.configurationString() + '.svg';
        });

        ko.rebind(this);
    }

    canBindToTarget() {
        return this.getAffinityScore() < 2;
    }

    getAffinityScore() {
        var slots = this.slots();

        // Lower is better, as it is an error-score
        var affinityScore = _.reduce(slots, (affinityScore, slot) => {
            var optimalBindingType = slot.bindingType;
            var optimalLength = slot.optimalLength;

            var matchesBindingType = _.contains(slot.sidegroup().info.bindingTypes, optimalBindingType);
            if (!matchesBindingType) {
                return affinityScore + 5;
            }else {
                var squaredLengthError = Math.pow((slot.sidegroup().info.bindingLength - optimalLength), 2);
                return affinityScore + squaredLengthError;
            }

        }, 0);

        return Math.sqrt(affinityScore);
    }

    clone() {
        var clone = new Scaffold(this.initialValues);

        clone.hasReacted(this.hasReacted());
        clone.slots(this.slots());
        clone.drugInfo = this.drugInfo;

        return clone;
    }
}

export = Scaffold;
