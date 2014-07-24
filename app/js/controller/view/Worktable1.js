define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'model/type/Container',
    'model/type/Liquid',

    'controller/SimpleContainer',
    'controller/CompositeContainer',

    'utils/QuizHelper'
], function (ko, $, BaseViewController, ContainerType, LiquidType, SimpleContainerController,
             CompositeContainerController, QuizHelper) {

    var Worktable1 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable1');

            self.worktable1 = self.gameState.worktable1;

            var tubeRackGuard = function () {// TODO: Fyr på hele worktable 1.
                if (!self.worktable1.bunsenBurner()) {
                    self.popupController.message('worktable1.bunsen_required.header', 'worktable1.bunsen_required.body');
                    return false;
                }
                return true;
            };

            self.tableSpacePetriController = new CompositeContainerController(self.worktable1.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.worktable1.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.worktable1.tubeRack);
            self.tubeRackController.dropGuard = tubeRackGuard;
            self.heaterController = new CompositeContainerController(self.worktable1.heater);
            self.electroporatorController = new SimpleContainerController(self.worktable1.electroporator); //TODO: simpleContainerController

            self.toggleBunsen = function () {
                self.worktable1.bunsenBurner.toggle();
                self.experimentController.triggerActivation(self.ActivationType.BUNSEN, self.worktable1.bunsenBurner());
            };

            self.toggleHeater = function () {
                self.worktable1.heater.status.toggle();
                self.experimentController.triggerActivation(self.ActivationType.HEATER, self.worktable1.heater);
            };

            self.activateElectroporator = function () {
                //TODO: check if electroporator contains both genes and organisms. If not, show a message.
                var containsOrganism = _.any(self.worktable1.electroporator.liquids(), function(liquid){
                    return liquid.type() === LiquidType.MICROORGANISM;
                });

                var containsGene = _.any(self.worktable1.electroporator.liquids(), function(liquid){
                    return liquid.type() === LiquidType.GENE;
                });

                if (! (containsGene && containsOrganism)) { //TODO: test.
                    //TODO: i18n
                    self.popupController.message('Prøv igen',
                        'Hvis du vil genmodificere en eller flere organismer, så er det en rigtig god idé at tilføje både organismer og noget DNA');
                    return;
                }

                //TODO: find out which videos and quizzes to show.
                var videoQuizNumber = self.worktable1.electroporator.getQuizVideo();
                console.log(videoQuizNumber);

                self.showElectroporatorVideos(videoQuizNumber).done(function() {
                    self.showElectroporatorQuiz(videoQuizNumber);
                });


                self.worktable1.electroporator.activate();
                self.experimentController.triggerActivation(self.ActivationType.ELECTROPORATOR, self.worktable1.electroporator);
            };

            self.showElectroporatorQuiz = function(quizNumber) {
                switch (quizNumber) {
                    case 1:
                        debugger;
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz1());
                        break;
                    case 2:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz2());
                        break;
                }


            };

            self.showElectroporatorVideos = function(videoNumber) {
                var videoList = [];

                for (var i = 1; i <= videoNumber; i++) {
                    videoList.push('electroporator' + i);
                }

                return self.popupController.video(videoList, true);

            };
        }
    });

    return Worktable1;
});
