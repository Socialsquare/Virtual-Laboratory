import MouseType = require('model/type/Mouse');

import experimentController = require('controller/Experiment');

import MouseViewController = require('controller/view/Mouse');

import MouseModel = require('model/Mouse');

class MouseHandler {

    static handle(MC: MouseViewController, mouse: MouseModel) {
        var oldMouse = MC.gameState.mouse();
        MC.gameState.mouse(mouse);
        MC.gameState.inventory.add(oldMouse);
        MC.enter();
        return true;
    }
}

export = MouseHandler;
