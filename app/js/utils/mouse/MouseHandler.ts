import MouseCageViewController = require('controller/view/MouseCageViewController');
import gameState = require('model/GameState');

import MouseModel = require('model/Mouse');

class MouseHandler {

    static handle(MC: MouseCageViewController, mouse: MouseModel) {
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
