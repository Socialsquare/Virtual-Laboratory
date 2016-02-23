import postbox = require('knockout.postbox');

import MouseCageController = require('controller/view/MouseCage');

import experimentController = require('controller/Experiment');

import gameState = require('model/GameState');
import MouseModel = require('model/Mouse');

import ActivationType = require('model/type/Activation');

import vetMonitorLog = require('service/VetMonitorLog');

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
        experimentController.triggerActivation(ActivationType.MOUSE_CAGE, mouse);
        return true;
    }
}

export = MouseHandler;
