define([
    'json!testdatadir/experiments.json',

    'lodash',

    'factory/Container',
    'factory/Liquid',

    'controller/Experiment',

    'model/Experiment'
], function (experimentData, _, CF, LF, experimentController, ExperimentModel) {

    var finishedTasks = function () {
        return _.filter(experimentController.activeExperiment().tasks(), function (task) {
            return task.finished();
        });
    };

    beforeEach(function () {
        experimentController.startExperiment(new ExperimentModel(experimentData[0]));
    });

    describe('Mix trigger', function() {
        it('should finish task on simple mix', function () {
            var tube = CF.tube();

            tube.add(LF.deadly());

            expect(finishedTasks().length).toBe(0);

            tube.add(LF.insulin());

            expect(finishedTasks().length).toBe(1);
        });

        it('should finish task on simple mix with additional liquids', function () {
            var tube = CF.tube();

            tube.add(LF.deadly());
            tube.add(LF.antibiotic.a());

            expect(finishedTasks().length).toBe(0);

            tube.add(LF.insulin());

            expect(finishedTasks().length).toBe(1);
        });

        it('should not finish task on strict mix with additional liquids', function () {
            var tube = CF.tube();

            // finish first task
            tube.add(LF.deadly());
            tube.add(LF.insulin());
            expect(finishedTasks().length).toBe(1);

            var tube2 = CF.tube();
            tube2.add(LF.antibiotic.a());
            tube2.add(LF.insulin());

            expect(finishedTasks().length).toBe(1);

            tube2.add(LF.deadly());

            expect(finishedTasks().length).toBe(1);
        });

        it('should finish task on strict mix', function () {
            var tube = CF.tube();

            // finish first task
            tube.add(LF.deadly());
            tube.add(LF.insulin());
            expect(finishedTasks().length).toBe(1);

            var tube2 = CF.tube();
            tube2.add(LF.insulin());

            expect(finishedTasks().length).toBe(1);

            tube2.add(LF.deadly());

            expect(finishedTasks().length).toBe(2);
        });
    });
});
