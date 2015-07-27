import SpecialItemModel = require('model/SpecialItem');
import Scalpel = require('model/Scalpel');
import Syringe = require('model/Syringe');
import Spleen = require('model/Spleen');
import Gel = require('model/Gel');
import Mouse = require('model/Mouse');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

import SpecialItemType = require('model/type/SpecialItem');

class SpecialItem {
    static scalpel() {
        return new Scalpel();
    }

    static syringe() {
        return new Syringe();
    }

    static spleen() {
        return new Spleen();
    }

    static washBottle() {
        return new SpecialItemModel(SpecialItemType.WASH_BOTTLE);
    }

    static buffer() {
        return new SpecialItemModel(SpecialItemType.BUFFER);
    }

    static gel() {
        return new Gel();
    }

    static healthyMouse() {
        return new Mouse(MouseType.HEALTHY, MouseBloodType.NORMAL);
    }

    static diabeticMouse() {
        return new Mouse(MouseType.HEALTHY, MouseBloodType.DIABETIC);
    }
}

export = SpecialItem;
