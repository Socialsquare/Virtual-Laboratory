define([
    'knockout',
    'jquery',
    'base',
    'controller/Popup'
], function (ko, $, Base, popupController) {

    var Quiz = Base.extend({

        constructor: function (quiz) {
            var self = this;

            self.popupController = popupController;
            self.currentPopupVM = null;
            self.quizPromise = null;
            self.activeQuiz = ko.observable(quiz);
            self.quizFinished = ko.observable(false);

            self.isCorrect = function (answer) {
                return answer.id() === self.activeQuiz().correct();
            };

            self.tryAnswer = function (answer) {
                if (self.isCorrect(answer)) self.quizFinished(true);
                answer.tried(true);
            };

            self.startQuiz = function (quiz) {
                self.quizPromise = $.Deferred();

                self.activeQuiz(quiz);
                self.showQuizPopup();
                self.playQuizVideo();

                return self.quizPromise;
            };

            self.playQuizVideo = function () {
                if (self.activeQuiz().hasVideo()) {
                    self.popupController.video(self.activeQuiz().video());
                }
            };

            self.showQuizPopup = function () {
                self.currentPopupVM = self.popupController.show('popup-quiz', { quizController: self });
            };

            self.endQuiz = function () {
                self.popupController.hide(self.currentPopupVM);
                self.quizPromise.resolve();
            };
        }
    });

    return new Quiz();
});
