import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');

import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');

import ElectroporatorController = require('controller/Electroporator');
import CompositeContainerController = require('controller/CompositeContainer');

import Worktable1Model = require('model/Worktable1');

import QuizHelper = require('utils/QuizHelper');

class Worktable1 extends BaseViewController {

    public worktable1: Worktable1Model;
    public tableSpacePetriController: CompositeContainerController;
    public tableSpaceMicroController: CompositeContainerController;
    public tubeRackController: CompositeContainerController;
    public heaterController: CompositeContainerController;
    public electroporatorController: ElectroporatorController;

    constructor() {
        super('worktable1');

        this.worktable1 = this.gameState.worktable1;

        this.tableSpacePetriController = new CompositeContainerController(this.worktable1.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.worktable1.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.worktable1.tubeRack);
        this.heaterController = new CompositeContainerController(this.worktable1.heater);
        this.electroporatorController = new ElectroporatorController(this.worktable1.electroporator);

        this.tableSpacePetriController.addDropGuard(this.bunsenGuard);
        this.tableSpaceMicroController.addDropGuard(this.bunsenGuard);
        this.tubeRackController.addDropGuard(this.bunsenGuard);
        this.heaterController.addDropGuard(this.bunsenGuard);

        this.tableSpacePetriController.addDropGuard(this.smallPoxGuard);
        this.tableSpaceMicroController.addDropGuard(this.smallPoxGuard);
        this.tubeRackController.addDropGuard(this.smallPoxGuard);
        this.heaterController.addDropGuard(this.smallPoxGuard);

        ko.rebind(this);
    }

    bunsenGuard(position, container) {
        if (!this.worktable1.bunsenBurner()) {
            this.popupController.message('worktable1.bunsen_required.header', 'worktable1.bunsen_required.body');
            return false;
        }
        return true;
    }

    toggleBunsen() {
        this.worktable1.bunsenBurner.toggle();
        this.experimentController.triggerActivation(ActivationType.BUNSEN, this.worktable1.bunsenBurner());
    }

    toggleHeater() {
        this.worktable1.heater.toggle();
        this.experimentController.triggerActivation(ActivationType.HEATER, this.worktable1.heater);
    }

    activateElectroporator() {
        var containsOrganism = _.any(this.worktable1.electroporator.liquids(), (liquid) => {
            return liquid.type() === LiquidType.MICROORGANISM;
        });

        var containsGene = _.any(this.worktable1.electroporator.liquids(), (liquid) => {
            return liquid.type() === LiquidType.GENE;
        });

        // check if electroporator contains both genes and organisms. If not, show a message.
        if (! (containsGene && containsOrganism)) {
            this.popupController.message('worktable1.electroporator_wont_start.header','worktable1.electroporator_wont_start.body');
            return;
        }

        var quizNumber = this.worktable1.electroporator.getQuizVideo();

        this.showElectroporatorVideos(quizNumber).done(() => { //TODO: uncomment
            this.showElectroporatorQuiz(quizNumber);
            if (quizNumber > 6)
                this.popupController.notify('worktable1.electroporator_success.header','worktable1.electroporator_success.body', 3500);
        });


        this.worktable1.electroporator.activate();
        this.experimentController.triggerActivation(ActivationType.ELECTROPORATOR, this.worktable1.electroporator);
    }

    showElectroporatorQuiz(quizNumber) {

        switch (quizNumber) {
        case 1:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz1());
            break;
        case 2:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz2());
            break;
        case 3:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz3());
            break;
        case 4:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz4());
            break;
        case 5:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz5());
            break;
        case 6:
            this.quizController.startQuiz(QuizHelper.electroporator.getQuiz6());
            break;
        }
    }

    showElectroporatorVideos(quizNumber) {
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

        var videoList = _.map(videoNumbers, (videoNumber) => {
            return 'electroporator' + videoNumber;
        });

        return this.popupController.video(videoList, true);

    }
}

export = Worktable1;
