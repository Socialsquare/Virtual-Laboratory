import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');

import CompositeContainerController = require('controller/CompositeContainer');

import Worktable3Model = require('model/Worktable3');

class Worktable3 extends BaseViewController {

    public worktable3: Worktable3Model;

    public tubeRackController: CompositeContainerController;
    public iceBathController: CompositeContainerController;

    constructor() {
        super('worktable3');

        this.worktable3 = this.gameState.worktable3;

        this.tubeRackController = new CompositeContainerController(this.worktable3.tubeRack);
        this.iceBathController = new CompositeContainerController(this.worktable3.iceBath);

    }
}

export = Worktable3;
