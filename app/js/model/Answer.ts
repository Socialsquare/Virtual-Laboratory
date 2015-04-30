import ko = require('knockout');

class Answer {

    public id: KnockoutObservable<number>;
    public answer: KnockoutObservable<string>;
    public message: KnockoutObservable<string>;
    public tried: KnockoutObservable<boolean>;

    constructor(values) {
        this.id = ko.observable(values.id);
        this.answer = ko.observable(values.answer);
        this.message = ko.observable(values.message);
        this.tried = ko.observable(false);
    }
}

export = Answer;
