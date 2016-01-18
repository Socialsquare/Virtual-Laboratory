import ko = require('knockout');
import $ = require('jquery');

import S2T = require('utils/S2T');

import TubeExtractionType = require('model/type/TubeExtraction');
import LiquidType = require('model/type/Liquid');

import PopupModel = require('model/Popup');

class TubeExtraction extends PopupModel {

    public promise: JQueryDeferred<LiquidType>;
    public type: TubeExtractionType;
    public typeString: KnockoutComputed<string>;

    constructor(type: TubeExtractionType) {
        super('popup-tube-extraction');

        this.type = type;
        this.promise = $.Deferred();

        ko.rebind(this);
    }

    isType(type: string) {
        return TubeExtractionType[type] === this.type;
    }

    extract(id: string) {
        var liquid = S2T.liquid(id);
        if (!liquid)
            throw 'Invalid liquid type';

        this.promise.resolve(liquid);
    }
}

export = TubeExtraction;
