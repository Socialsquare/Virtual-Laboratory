import ko = require('knockout');
import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

class Fumehood extends BaseViewController {

    constructor() {

        super('fumehood');

        this.fumehood = this.gameState.fumehood;

        this.tableSpacePetriController = new CompositeContainerController(this.fumehood.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.fumehood.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.fumehood.tubeRack);
    }

}

export = Fumehood;
