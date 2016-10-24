import ko = require('knockout');
import _ = require('lodash');

import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');

class Liquid {

    public type: KnockoutObservable<LiquidType>;
    public reactionCount: KnockoutObservable<ReactionCount>;
    public hasReacted: KnockoutObservable<boolean>;
    // Determines whether a liquid contaminates the pipette
    public isContaminating: KnockoutObservable<boolean>;

    public subtype: KnockoutObservable<any>;

    constructor(type, reactionCount = ReactionCount.NEVER, isContaminating = true) {
        this.type = ko.observable(type);
        this.reactionCount = ko.observable(reactionCount);
        this.hasReacted = ko.observable(false);
        this.isContaminating = ko.observable(isContaminating);

        this.subtype = ko.observable(); // defaults to no subtype

        ko.rebind(this);
    }

    protected _react(container, fn) {
        if (this.reactionCount() === ReactionCount.NEVER ||
            (this.hasReacted() && this.reactionCount() === ReactionCount.ONCE))
            return;

        var reacted = false;
        _.forEach(container.liquids(), (liquid) => {
            if (this === liquid) return;

            fn(liquid);
            reacted = true;
        });

        if (reacted) this.hasReacted(true);
    }

    react(container) {
        this._react(container, _.noop);
    }

    protected _hashCode() {
        return this.type() + ':' + this.reactionCount() + ':' + this.hasReacted();
    }

    hashCode() {
        return this._hashCode();
    }

    clone() {
        var clone = new Liquid(this.type(), this.reactionCount());
        clone.subtype(this.subtype());
        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = Liquid;
