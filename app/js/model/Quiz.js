define([
    'knockout',
    'lodash',
    'base',
    'model/Answer'
], function (ko, _, Base, AnswerModel) {

    var Quiz = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.name = ko.observable(values.name);
            self.question = ko.observable(values.question);
            self.correct = ko.observable(values.correct);

            self.video = ko.observable(values.video);

            self.hasVideo = ko.computed(function () {
                return !!self.video();
            });

            var answers = _.map(values.answers, function (answer) {
                return new AnswerModel(answer);
            });

            self.answers = ko.observableArray(answers);
        }
    });

    return Quiz;
});
