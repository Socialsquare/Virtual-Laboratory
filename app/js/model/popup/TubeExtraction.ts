import ko = require('knockout');
import $ = require('jquery');

import S2T = require('utils/S2T');

import TubeExtractionType = require('model/type/TubeExtraction');
import LiquidType = require('model/type/Liquid');

import PopupModel = require('model/Popup');

class TubeExtraction extends PopupModel {

    public promise: JQueryDeferred<LiquidType>;
    public selected: KnockoutObservable<LiquidType>;
    public type: TubeExtractionType;
    public typeString: KnockoutComputed<string>;

    constructor(type: TubeExtractionType) {
        super('popup-tube-extraction');

        this.type = type;
        this.promise = $.Deferred();
        this.selected = ko.observable(null);

        ko.rebind(this);
    }

    isType(type: string) {
        return TubeExtractionType[type] === this.type;
    }

    selectExtraction(id: string) {
        var liquid = S2T.liquid(id);
        if (!liquid)
            throw 'Invalid liquid type';

        this.selected(liquid);
    }

    extract() {
        this.promise.resolve(this.selected());
    }
}

export = TubeExtraction;
