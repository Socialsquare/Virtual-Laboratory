import Tube = require('model/Tube');
import Petridish = require('model/Petridish');
import Microtiterplate = require('model/Microtiterplate');
import Syringe = require('model/Syringe');
import Bottle = require('model/Bottle');

import AntigenCoatingType = require('model/type/AntigenCoating');

class Container {

    static tube() {
        return new Tube();
    }

    static petri() {
        return new Petridish();
    }

    static micro() {
        return new Microtiterplate();
    }

    static microAntigenCoated() {
        return new Microtiterplate(AntigenCoatingType.ANY);
    }

    static syringe() {
        return new Syringe();
    }

    static bottle() {
        return new Bottle();
    }
}

export = Container;
