define([
    'knockout',
    'model/Consequence',
    'model/Quiz',
    'model/type/Consequence'
], function (ko, ConsequenceModel, QuizModel, ConsequenceType) {
    var QuizConsequence = ConsequenceModel.extend({
        constructor: function (quiz) {
            var self = this;
            self.base(ConsequenceType.QUIZ);
            self.quiz = new QuizModel(quiz);
        }
    });

    return QuizConsequence;
});
