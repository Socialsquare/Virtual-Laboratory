import ko = require('knockout');
import $ = require('jquery');
import SimpleContainerController = require('controller/SimpleContainer');
import BaseViewController = require('controller/view/Base');

class Fermentor extends BaseViewController {

    public fermentor;
    public fermentorTankController;

    constructor() {
        super('fermentor');

        this.fermentor = this.gameState.fermentor;
        this.fermentorTankController = new SimpleContainerController(this.fermentor.fermentorTank, this.gameState);
    }
}

export = Fermentor;
