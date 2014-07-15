define([
    'knockout',
    'base',
    'service/Quiz'
], function (ko, Base, QuizService) {

    var Quiz = Base.extend({

        constructor: function (quizId) {
            var self = this;

            self.quizService = new QuizService();
            self.activeQuiz = ko.observable(null);
            self.quizFinished = ko.observable(false);

            self.hasQuiz = ko.computed(function () {
                return !!self.activeQuiz();
            });

            self.quizService.getQuiz(quizId).done(function (quiz) {
                self.activeQuiz(quiz);
            });

            self.isCorrect = function (answer) {
                return answer.id() === self.activeQuiz().correct();
            };

            self.tryAnswer = function (answer) {
                if (self.isCorrect(answer)) self.quizFinished(true);
                answer.tried(true);
            };
        }
    });

    return Quiz;
});
