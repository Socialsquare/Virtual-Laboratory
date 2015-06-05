import ko = require('knockout');
import _ = require('lodash');

import AnswerModel = require('model/Answer');

class Quiz {

    public id: KnockoutObservable<number>;
    public name: KnockoutObservable<string>;
    public question: KnockoutObservable<string>;
    public correct: KnockoutObservable<number>;
    public video: KnockoutObservable<string>;
    public hasVideo: KnockoutComputed<boolean>;
    public answers: KnockoutObservableArray<AnswerModel>;

    constructor(values) {

        this.id = ko.observable(values.id);
        this.name = ko.observable(values.name);
        this.question = ko.observable(values.question);
        this.correct = ko.observable(values.correct);

        this.video = ko.observable(values.video);

        this.hasVideo = ko.pureComputed(() => {
            return !!this.video();
        });

        var answers = _.map(values.answers, (a) => new AnswerModel(a));

        this.answers = ko.observableArray(answers);
    }
}

export = Quiz;
