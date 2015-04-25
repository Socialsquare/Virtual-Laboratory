import ko = require(    'knockout');
import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

class UvRoom extends BaseViewController {
    constructor() {
        super('uvroom');

        this.uvroom = this.gameState.uvroom;

        this.tableSpacePetriController = new CompositeContainerController(this.uvroom.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.uvroom.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.uvroom.tubeRack);
    }
}

export = UvRoom;
