import BottleHandler = require('utils/mouse/BottleHandler');
import ScalpelHandler = require('utils/mouse/ScalpelHandler');
import SyringeHandler = require('utils/mouse/SyringeHandler');
import TubeHandler = require('utils/mouse/TubeHandler');

import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');

import MouseViewController = require('controller/view/Mouse');

class DropOnMouseHelper {

    static handleDrop(MC: MouseViewController, item) {

        if(MC.mouse().isInteracting())
            return false;

        //TODO: decision tree based on 1st item, 2nd mouseType
        switch(item.type()) {
        case ContainerType.BOTTLE:
            return BottleHandler.handle(MC, item);

        case SpecialItemType.SCALPEL:
            return ScalpelHandler.handle(MC, item);

        case ContainerType.SYRINGE:
            return SyringeHandler.handle(MC, item);

        case ContainerType.TUBE:
            return TubeHandler.handle(MC, item);

        }
    }
}

export = DropOnMouseHelper;
