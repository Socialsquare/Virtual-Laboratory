
import experimentService = require('service/Experiment');

export const initiateExperimentAtStep = (app, experimentNum, partNum, taskNum) => {
    console.log('loaded!')
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

        app.router.navigate('overview');

    });
}
