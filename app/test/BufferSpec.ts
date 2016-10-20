import postbox = require('knockout.postbox');
import gameState = require('model/GameState');
import SpecialItemFactory = require('factory/SpecialItem');
import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');
import experimentController = require('controller/Experiment');
import ActivationType = require('model/type/Activation');

import CompositeContainerController = require('controller/CompositeContainer');

describe('Buffer', () => {
    it('Can be dropped on a microttiter plate in the Fumehood', () => {
        const microtiter = ContainerFactory.microAntigenCoated();
        microtiter.add(LiquidFactory.saltWater());
        expect(microtiter.liquids().length).toBe(1);

        const buffer = SpecialItemFactory.buffer();

        const tableSpaceMicroController = new CompositeContainerController(gameState.fumehood.tableSpaceMicro);
        tableSpaceMicroController.dropHandler(1, microtiter);

        spyOn(experimentController, 'triggerActivation')
        tableSpaceMicroController.handleContainerDrop(1, buffer);
        expect(experimentController.triggerActivation).toHaveBeenCalledWith(
            ActivationType.MICROTITER_WASHED_WITH_BUFFER,
            microtiter
        )

        expect(microtiter.liquids().length).toBe(1);

    });
});