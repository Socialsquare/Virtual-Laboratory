import ko = require('knockout');

import TriggerModel = require('model/Trigger');
import BaseConsequenceModel = require('model/Consequence');
import QuizConsequenceModel = require('model/QuizConsequence');
import VideoConsequenceModel = require('model/VideoConsequence');

import ConsequenceType = require('model/type/Consequence');

import S2T = require('utils/S2T');

class Task {

    public id: KnockoutObservable<string>;
    public finished: KnockoutObservable<boolean>;
    public trigger: KnockoutObservable<TriggerModel>;
    public description: KnockoutObservable<string>;
    public consequence: KnockoutObservable<BaseConsequenceModel>;
    public hasConsequence: KnockoutComputed<boolean>;

    // TODO! not used?
    public video: KnockoutObservable<string>;

    constructor(values: any) {

        this.id = ko.observable(values.id);
        this.finished = ko.observable(false);
        this.trigger = ko.observable(new TriggerModel(values.trigger));
        this.description = ko.observable(values.description);
        this.video = ko.observable(values.video);

        this.consequence = ko.observable(null);

        if (values.consequence) {
            var consequenceType = S2T.consequence(values.consequence.type);
            switch (consequenceType) {
            case ConsequenceType.QUIZ:
                this.consequence(new QuizConsequenceModel(values.consequence.quiz));
                break;
            case ConsequenceType.VIDEO:
                this.consequence(new VideoConsequenceModel(values.consequence.video));
                break;
            }
        }

        this.hasConsequence = ko.pureComputed(() => {
            return !!this.consequence();
        });

        ko.rebind(this);
    }
}

export = Task;
