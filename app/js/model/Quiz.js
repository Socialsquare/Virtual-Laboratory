define([
    'knockout',
    'base',
    'model/Answer'
], function (ko, Base, AnswerModel) {

    var Quiz = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.name = ko.observable(values.name);
            self.question = ko.observable(values.question);
            self.correct = ko.observable(values.correct);

            var answers = _.map(values.answers, function (answer) {
                return new AnswerModel(answer);
            });
            self.answers = ko.observableArray(answers);
        }
    });

    return Quiz;
});
