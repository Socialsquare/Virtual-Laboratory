import ko = require('knockout');
import _ = require('lodash');

import router = require('controller/Router');

import PopupModel = require('model/Popup');

class List<T> extends PopupModel {

    public items: KnockoutObservableArray<T>;
    public title: string;
    public itemTakenCallback: (T) => void;

    constructor(title: string, items: T[], itemTakenCallback: (T) => void) {
        super('popup-list', null, null);

        this.items = ko.observableArray(items);
        this.title = title;
        this.itemTakenCallback = itemTakenCallback;

        ko.rebind(this);
    }
}

export = List
