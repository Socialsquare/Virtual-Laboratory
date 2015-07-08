import ko = require('knockout');

import gameState = require('model/GameState');

import GelModel = require('model/Gel');

import BaseViewController = require('controller/view/Base');
import GelElectroController = require('controller/GelElectro');

class GelElectro extends BaseViewController {

    public gelElectroController: GelElectroController;

    constructor() {
        super('gelelectro');

        this.gelElectroController = new GelElectroController(gameState.worktable2.gelElectro);
    }
}

export = GelElectro;
