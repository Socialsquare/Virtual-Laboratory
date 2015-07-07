import _ = require('lodash');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import SpecialItemType = require('model/type/SpecialItem');

class DragHelper {

    static accepter(types) {
        return (item) => {
            return item && item.type && _.contains(types, item.type());
        };
    };

    static nonAccepter(types) {
        return (item) => {
            return item && item.type && !_.contains(types, item.type());
        };
    };

    static consumeItemFrom(item, collection) {
        return () => collection.remove(item);
    };

    static acceptTube = DragHelper.accepter([ContainerType.TUBE]);

    static acceptPetri = DragHelper.accepter([ContainerType.PETRI_DISH]);

    static acceptMicro = DragHelper.accepter([ContainerType.MICROTITER]);

    static acceptDNA = DragHelper.accepter([LiquidType.DNA]);

    static acceptPipette = DragHelper.accepter([ContainerType.PIPETTE]);

    static acceptSyringe = DragHelper.accepter([ContainerType.SYRINGE]);

    static acceptSidegroup = DragHelper.accepter([SpecialItemType.SIDEGROUP]);

    static acceptSidegroupSlot = DragHelper.accepter([SpecialItemType.SIDEGROUP_SLOT]);

    static acceptedByInventory = DragHelper.nonAccepter([
        ContainerType.BOTTLE,
        LiquidType.DNA,
        ContainerType.PIPETTE,
        SpecialItemType.SIDEGROUP
    ]);

    static acceptedByBlender = DragHelper.accepter([SpecialItemType.SPLEEN]);

    static acceptedByWashing = DragHelper.accepter([ContainerType.TUBE]);

    static acceptedByComposite = DragHelper.accepter([
        ContainerType.PIPETTE,
        ContainerType.SYRINGE,
        SpecialItemType.BUFFER,
        SpecialItemType.WASH_BOTTLE,
    ]);

    static acceptedByMouse = DragHelper.accepter([
        ContainerType.SYRINGE,
        ContainerType.BOTTLE,
        ContainerType.TUBE,
        SpecialItemType.SCALPEL,
        SpecialItemType.MOUSE
    ]);
}

export = DragHelper;
