import ko = require('knockout');

import InventoryItem = require('model/InventoryItem');

class ChemicalItem {

    public itemGetter: () => InventoryItem;
    public item: KnockoutObservable<InventoryItem>;
    public name: KnockoutObservable<string>;

    constructor(name, itemGetter) {
        this.name = ko.observable(name);
        this.itemGetter = itemGetter;
        this.item = ko.observable(itemGetter());
    }
}

export = ChemicalItem;
