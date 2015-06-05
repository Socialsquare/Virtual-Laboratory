import ko = require('knockout');

import TutorialMessage = require('model/TutorialMessage');
import tutorialData = require('json!datadir/tutorial.json');

class Tutorial {

    public active: KnockoutObservable<boolean>;
    public messages: KnockoutObservableArray<TutorialMessage>;
    public currentMessageIndex: KnockoutObservable<number>;
    public currentMessage: KnockoutComputed<TutorialMessage>;
    public arrowImage: KnockoutComputed<string>;
    public arrowClasses: KnockoutComputed<string>;

    constructor() {

        this.active = ko.observable(false);

        // hardcoded tutorial box positions
        var msgs = _.map(tutorialData, (msg) => new TutorialMessage(msg));
        this.messages = ko.observableArray(msgs);

        this.currentMessageIndex = ko.observable(0);

        this.currentMessage = ko.pureComputed(() => {
            return this.messages()[this.currentMessageIndex()];
        });

        this.arrowImage = ko.pureComputed(() => {
            var state = this.currentMessage().arrowTop ? 'up' : 'down';
            return 'assets/images/arrow_' + state + '.png';
        });

        this.arrowClasses = ko.pureComputed(() => {
            var hor = this.currentMessage().arrowTop ? 'top' : 'bottom';
            var ver = this.currentMessage().arrowLeft ? 'left' : 'right';
            return hor + ' ' + ver;
        });

        ko.rebind(this);
    }

    next() {
        if (this.currentMessageIndex() === this.messages().length - 1) {
            this.active(false);
        } else {
            this.currentMessageIndex(this.currentMessageIndex() + 1);
        }
    }

    startTutorial() {
        this.active(true);
    }
}

export = new Tutorial();
