define([
    'knockout',
    'base',
    'model/Quiz',
    'model/QuizConsequence',
    'model/VideoConsequence',
    'model/type/Consequence'
], function(ko, Base, QuizModel, QuizConsequenceModel, VideoConsequenceModel, ConsequenceType) {

    var Task = Base.extend({

        constructor: function (values) {
            var self = this;

            self.finished = ko.observable(false);
            self.id = ko.observable(values.id);
            self.trigger = ko.observable(values.trigger);
            self.video = ko.observable(values.video);
            self.description = ko.observable(values.description);

            self.consequence = ko.observable();

            if (values.consequence) {
                switch (values.consequence.type) {
                case ConsequenceType.QUIZ:
                    self.consequence(new QuizConsequenceModel(values.consequence.quiz));
                    break;
                case ConsequenceType.VIDEO:
                    self.consequence(new VideoConsequenceModel(values.consequence.video));
                    break;
                }
            }

            self.hasConsequence = ko.computed(function () {
                return !!self.consequence();
            });

        }
    });

    return Task;
});
