import postbox = require('knockout.postbox');
import MouseCageController = require('controller/view/MouseCage');
import gameState = require('model/GameState');
import vetMonitorLog = require('service/VetMonitorLog');
import MouseModel = require('model/Mouse');

class MouseHandler {

    static handle(MC: MouseCageController, mouse: MouseModel) {
        console.log("MouseHandler.handle");
        vetMonitorLog.updateLogId();
        if (gameState.mousecage.hasMouse()) {
            var oldMouse = gameState.mousecage.mouse();
            oldMouse.resetInfusion();
            oldMouse.resetBloodSugar();
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
