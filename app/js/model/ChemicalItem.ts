import ko = require('knockout');

import Item = require('model/Item');

class ChemicalItem extends Item {

    public itemGetter: () => any;
    public item: KnockoutObservable<Item>;

    constructor(name, itemGetter) {
        super(name);

        this.itemGetter = itemGetter;
        this.item = ko.observable(itemGetter());
    }
}

export = ChemicalItem;
