import ko = require('knockout');
import $ = require('jquery');
import SimpleContainerController = require('controller/SimpleContainer');
import BaseViewController = require('controller/view/Base');
import FermentorModel = require('model/Fermentor');

class Fermentor extends BaseViewController {

    public fermentor: FermentorModel;
    public fermentorTankController: SimpleContainerController;

    constructor() {
        super('fermentor');

        this.fermentor = this.gameState.fermentor;
        this.fermentorTankController = new SimpleContainerController(this.fermentor.fermentorTank);
    }
}

export = Fermentor;
