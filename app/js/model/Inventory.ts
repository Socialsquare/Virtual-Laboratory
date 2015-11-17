import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');

import TextHelper = require('utils/TextHelper');

import InventoryItem = require('model/InventoryItem');

import LocationType = require('model/type/Location');

class Inventory {

    public items: KnockoutObservableArray<InventoryItem>;

    constructor() {

        this.items = ko.observableArray([]);

        ko.rebind(this);
    }

    add(item, alternativeLabel = '', additionalInfo={}) {
        // generate label
        if (!item.acquired() && item.label) {
            if (alternativeLabel) {
                item.label(alternativeLabel);
            } else {
                item.label(TextHelper.label(item));
            }
            if (additionalInfo) {
                var info = '\n\n';
                _.each(additionalInfo, (val, key) => {
                    info += key + ': ' + val.value + ' ' + val.unit + '\n';
                });
                item.label(item.label()+info);
            }
        }

        if (!item.acquired()) {
            experimentController.triggerAcquisition(item);
        }

        item.acquired(true);

        if (item.hasOwnProperty('location')) {
            item.location(LocationType.INVENTORY);
        }

        this.items.push(item);
    }

    hasItem(item) {
        return _.contains(this.items(), item);
    }

    remove(item) {
        this.items.remove(item);
    }

    reset() {
        this.items.removeAll();
    }
}

export = Inventory;
