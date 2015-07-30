import MouseViewController = require('controller/view/Mouse');
import gameState = require('model/GameState');

import MouseModel = require('model/Mouse');

class MouseHandler {

    static handle(MC: MouseViewController, mouse: MouseModel) {
        if (MC.gameState.mousecage.hasMouse()) {
            var oldMouse = MC.gameState.mousecage.mouse();
            MC.gameState.inventory.add(oldMouse);
        }
        gameState.inventory.remove(mouse);
        MC.gameState.mousecage.mouse(mouse);
        MC.runFromState();
        MC.toggleSimulation(true);
        return true;
    }
}

export = MouseHandler;
