define([
    'knockout',
    'lodash',
    'jquery',
    'controller/view/Base',
    'model/type/Container',
    'model/type/Liquid',

    'controller/SimpleContainer',
    'controller/CompositeContainer',

    'utils/QuizHelper'
], function (ko, _, $, BaseViewController, ContainerType, LiquidType, SimpleContainerController,
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
            self.electroporatorController = new SimpleContainerController(self.worktable1.electroporator, self.gameState);

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

                if (! (containsGene && containsOrganism)) {
                    self.popupController.message('worktable1.electroporator_wont_start.header','worktable1.electroporator_wont_start.body');
                    return;
                }

                var quizNumber = self.worktable1.electroporator.getQuizVideo();

                self.showElectroporatorVideos(quizNumber).done(function() { //TODO: uncomment
                    self.showElectroporatorQuiz(quizNumber);
                    if (quizNumber > 6)
                        self.popupController.notify('worktable1.electroporator_success.header','worktable1.electroporator_success.body', 3500);
                });


                self.worktable1.electroporator.activate();
                self.experimentController.triggerActivation(self.ActivationType.ELECTROPORATOR, self.worktable1.electroporator);


            };

            self.showElectroporatorQuiz = function(quizNumber) {

                switch (quizNumber) {
                    case 1:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz1());
                        break;
                    case 2:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz2());
                        break;
                    case 3:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz3());
                        break;
                    case 4:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz4());
                        break;
                    case 5:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz5());
                        break;
                    case 6:
                        self.quizController.startQuiz(QuizHelper.electroporator.getQuiz6());
                        break;
                }


            };

            self.showElectroporatorVideos = function(quizNumber) {
                var videoNumbers = [];

                // Video #1 = elektroporatoring
                // Video #2 = transskription start
                // Video #3 = transskription stop
                // Video #4 = ribosome binding
                // Video #5 = translation
                // Video #6 = translation stopping

                // Quiz #1 - mangler promoter:                 videos = [1]
                // Quiz #2 - mangler terminator                videos = [1,2]
                // Quiz #3 - mangler RBS                       videos = [1,2,3]
                // Quiz #4 - mangler Start Codon               videos = [1,2,3,4]
                // Quiz #5 - mangler proteinkodende sekvens    videos = [1,2,3,4,5]
                // Quiz #6 - mangler Stop Codon                videos = [1,2,3,4,5]
                // else                                        videos = [1,2,3,4,5,6]

                switch (quizNumber) {
                    case 1:
                        videoNumbers = [1];
                        break;
                    case 2:
                        videoNumbers = [1,2];
                        break;
                    case 3:
                        videoNumbers = [1,2,3];
                        break;
                    case 4:
                        videoNumbers = [1,2,3,4];
                        break;
                    case 5:
                        videoNumbers = [1,2,3,4,5];
                        break;
                    case 6:
                        videoNumbers = [1,2,3,4,5];
                        break;
                    default:
                        videoNumbers = [1,2,3,4,5,6];
                        break;
                }

                var videoList = _.map(videoNumbers, function(videoNumber) {
                    return 'electroporator' + videoNumber;
                });

                return self.popupController.video(videoList, true);

            };
        }
    });

    return Worktable1;
});
