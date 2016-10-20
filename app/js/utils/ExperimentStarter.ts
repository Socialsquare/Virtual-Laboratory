import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');
import gameState = require('model/GameState');

import experimentService = require('service/Experiment');

export const initiateExperimentAtStep = (app, experimentNum, partNum, taskNum) => {
    console.log('experiments loaded!');
    experimentService.getExperiments().done((experiments) => {
        const experiment = experiments[experimentNum];
        const expController = app.experimentController;
        //this.experiments(experiments);
        expController.startExperiment(experiment);

        const parts = expController.activeExperiment().parts();
        const tasks = expController.activeExperiment().tasks();

        for (let i = 0; i < partNum; i++) {
            parts[i].finished(true);
        }

        for (let i = 0; i < taskNum; i++) {
            tasks[i].finished(true);
        }

        const microtiter = ContainerFactory.microAntigenCoated()
        microtiter.add(LiquidFactory.antigenSmallpox())
        microtiter.add(LiquidFactory.saltWater())
        microtiter.add(LiquidFactory.hybridomaMedium())
        microtiter.add(LiquidFactory.microorganism.myeloma())
        microtiter.add(LiquidFactory.homoSpleen(LiquidFactory.antibodySmallpox()))
        microtiter.add(LiquidFactory.fluorescentSecondaryAntibody())

        gameState.inventory.add(microtiter);

        app.router.navigate('overview');

    });
}
