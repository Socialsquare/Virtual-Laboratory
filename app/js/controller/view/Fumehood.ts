import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import FumehoodModel = require('model/Fumehood');
import gameState = require('model/GameState');

class Fumehood extends BaseViewController {

    public fumehood: FumehoodModel;

    public tableSpacePetriController: CompositeContainerController;
    public tableSpaceMicroController: CompositeContainerController;
    public tubeRackController: CompositeContainerController;

    constructor() {

        super('fumehood');

        this.fumehood = gameState.fumehood;

        this.tableSpacePetriController = new CompositeContainerController(this.fumehood.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.fumehood.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.fumehood.tubeRack);
    }

}

export = Fumehood;
