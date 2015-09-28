import BottleHandler = require('utils/mouse/BottleHandler');
import ScalpelHandler = require('utils/mouse/ScalpelHandler');
import SyringeHandler = require('utils/mouse/SyringeHandler');
import TubeHandler = require('utils/mouse/TubeHandler');
import MouseHandler = require('utils/mouse/MouseHandler');

import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');

import MouseCageController = require('controller/view/MouseCageController');

class DropOnMouseHelper {

    static handleDrop(MC: MouseCageController, item) {
        if (MC.mousecage.hasMouse() && MC.mousecage.mouse().isInteracting())
            return false;

        //TODO: decision tree based on 1st item, 2nd mouseType
        switch (item.type()) {
        case ContainerType.BOTTLE:
            return BottleHandler.handle(MC, item);

        case SpecialItemType.SCALPEL:
            return ScalpelHandler.handle(MC, item);

        case SpecialItemType.MOUSE:
            return MouseHandler.handle(MC, item);

        case ContainerType.SYRINGE:
            return SyringeHandler.handle(MC, item);

        case ContainerType.TUBE:
            return TubeHandler.handle(MC, item);

        }
    }
}

export = DropOnMouseHelper;
