import ko = require('knockout');
import _ = require('lodash');

import router = require('controller/Router');

import PopupModel = require('model/Popup');

class List<T> extends PopupModel {

    public items: KnockoutObservableArray<T>;
    public title: string;
    public itemTakenCallback: (T) => void;

    public pageSize: number = 10;
    public pagedItems: KnockoutComputed<T[]>;
    public currentPage: KnockoutObservable<number>;
    public hasNext: KnockoutComputed<boolean>;
    public hasPrevious: KnockoutComputed<boolean>;

    constructor(title: string, items: T[], itemTakenCallback: (T) => void) {
        super('popup-list');

        this.items = ko.observableArray(items);
        this.title = title;
        this.itemTakenCallback = itemTakenCallback;

        this.currentPage = ko.observable(0);

        this.pagedItems = ko.pureComputed(() => {
            return _(this.items())
                .drop(this.currentPage() * this.pageSize)
                .take(this.pageSize)
                .value();
        }, this);

        this.hasNext = ko.pureComputed(() => {
            return this.items().length >= (this.currentPage() + 1) * this.pageSize;
        });

        this.hasPrevious = ko.pureComputed(() => {
            return this.currentPage() > 0;
        });

        ko.rebind(this);
    }

    nextPage() {
        if (this.hasNext())
            this.currentPage(this.currentPage() + 1);
    }

    prevPage() {
        if (this.hasPrevious())
            this.currentPage(this.currentPage() - 1);
    }
}

export = List
