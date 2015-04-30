import ko = require('knockout');

import Tube = require('model/Tube');
import Petridish = require('model/Petridish');
import Microtiterplate = require('model/Microtiterplate');
import Syringe = require('model/Syringe');
import Bottle = require('model/Bottle');

import AntigenCoatingType = require('model/type/AntigenCoating');

class Container {

    static tube = () => new Tube();

    static petri = () => new Petridish();

    static micro = () => new Microtiterplate();

    static microAntigenCoated = () => new Microtiterplate(AntigenCoatingType.ANY);

    static syringe = () => new Syringe();

    static bottle = () => new Bottle();
}

export = Container;
