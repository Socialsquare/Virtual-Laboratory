define([
    'lodash',
    'jquery',
    'service/Base',
    'model/Quiz'
], function (_, $, BaseService, QuizModel) {

    var QuizService = BaseService.extend({

        constructor: function () {
            var self = this;

            self.quizzesPromise = $.Deferred();

            // load data immediately
            self.get('/data/quiz.json')
                .done(function (quizzes) {
                    var parsed = _.map(quizzes.dk, function (quiz) {
                        return new QuizModel(quiz);
                    });

                    self.quizzesPromise.resolve(parsed);
                });
        },

        getQuiz: function (id) {
            var self = this;

            var promise = $.Deferred();

            self.quizzesPromise.done(function (quizzes) {
                var quiz = _.find(quizzes, function (quiz) {
                    return quiz.id() === id;
                });

                promise.resolve(quiz);
            });

            return promise;
        }
    });

    return QuizService;
});
