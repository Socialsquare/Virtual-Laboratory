import ko = require('knockout');
import $ = require('jquery');

import popupController = require('controller/Popup');

import QuizModel = require('model/Quiz');
import PopupModel = require('model/Popup');

class Quiz {

    public currentPopupVM: PopupModel;
    public quizPromise: JQueryDeferred<any>;
    public activeQuiz: KnockoutObservable<QuizModel>;
    public quizFinished: KnockoutObservable<boolean>;

    constructor() {
        this.currentPopupVM = null;
        this.quizPromise = null;
        this.activeQuiz = ko.observable(null);
        this.quizFinished = ko.observable(false);

        ko.rebind(this);
    }

    isCorrect(answer) {
        return answer.id() === this.activeQuiz().correct();
    }

    tryAnswer(answer) {
        if (this.isCorrect(answer)) this.quizFinished(true);
        answer.tried(true);
    }

    startQuiz(quiz) {
        this.quizPromise = $.Deferred();

        this.activeQuiz(quiz);
        this.showQuizPopup();

        this.playQuizVideo();

        return this.quizPromise;
    }

    playQuizVideo() {
        if (this.activeQuiz().hasVideo()) {
            popupController.video(this.activeQuiz().video(), true);
        }
    }

    showQuizPopup() {
        this.currentPopupVM = popupController.show('popup-quiz', {
            quizController: this
        });
    }

    endQuiz() {
        popupController.hide(this.currentPopupVM);
        this.quizPromise.resolve();
    }
}

export = new Quiz();
