import MouseCageController = require('controller/view/MouseCage');
import gameState = require('model/GameState');

import MouseModel = require('model/Mouse');

class MouseHandler {

    static handle(MC: MouseCageController, mouse: MouseModel) {
        if (gameState.mousecage.hasMouse()) {
            var oldMouse = gameState.mousecage.mouse();
            gameState.inventory.add(oldMouse);
        }
        gameState.inventory.remove(mouse);
        gameState.mousecage.mouse(mouse);
        MC.runFromState();
        MC.toggleSimulation(true);
        return true;
    }
}

export = MouseHandler;
