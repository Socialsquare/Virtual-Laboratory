import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');

import TextHelper = require('utils/TextHelper');

import InventoryItem = require('model/InventoryItem');

import LocationType = require('model/type/Location');
import LiquidDataType = require('model/type/LiquidData');

class Inventory {

    public items: KnockoutObservableArray<InventoryItem>;

    constructor() {

        this.items = ko.observableArray([]);

        ko.rebind(this);
    }

    add(item, alternativeLabel = '', liquidData:LiquidDataType[] = []) {
        if (!item.acquired()) {
            var info = '';
            if (liquidData.length > 0) {
                _.each(liquidData, (d) => {
                    info += d.text + ': ' + d.value + ' ' + d.unit + '\n';
                });
            } else if (alternativeLabel) {
                info += alternativeLabel;
            }
            item.extraInfo(info);
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
