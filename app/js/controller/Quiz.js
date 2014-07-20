define([
    'knockout',
    'base',
    'controller/Popup'
], function (ko, Base, popupController) {

    var Quiz = Base.extend({

        constructor: function (quiz) {
            var self = this;

            self.popupController = popupController;
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
                self.activeQuiz(quiz);
                self.showQuizPopup();
                self.playQuizVideo();

                // if (self.activeQuiz().hasVideo()) {
                //     self.popupController.video(self.activeQuiz().video()).then(function () {
                //         self.showQuizPopup();
                //     });
                // } else {
                // }
            };

            self.playQuizVideo = function () {
                if (self.activeQuiz().hasVideo()) {
                    self.popupController.video(self.activeQuiz().video());
                }
            };

            self.showQuizPopup = function () {
                self.popupController.show('popup-quiz', { quizController: self });
            };
        }
    });

    return new Quiz();
});
