import ko = require('knockout');
import $ = require('jquery');

import FermentorTankController = require('controller/FermentorTank');
import BaseViewController = require('controller/view/Base');
import FermentorModel = require('model/Fermentor');

class Fermentor extends BaseViewController {

    public fermentor: FermentorModel;
    public fermentorTankController: FermentorTankController;

    constructor() {
        super('fermentor');

        this.fermentor = this.gameState.fermentor;
        this.fermentorTankController = new FermentorTankController(this.fermentor.fermentorTank);
    }
}

export = Fermentor;
