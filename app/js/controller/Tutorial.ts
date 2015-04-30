import ko = require('knockout');
import tutorialData = require('json!datadir/tutorial.json');

class Tutorial {

    public active: KnockoutObservable<boolean>;
    public messages: KnockoutObservableArray<any>;
    public currentMessageIndex: KnockoutObservable<number>;
    public currentMessage: KnockoutComputed<string>;
    public arrowImage: KnockoutComputed<string>;
    public arrowClasses: KnockoutComputed<string>;

    constructor() {

        this.active = ko.observable(false);

        // hardcoded tutorial box positions
        this.messages = ko.observableArray(tutorialData);

        this.currentMessageIndex = ko.observable(0);

        this.currentMessage = ko.computed(() => {
            return this.messages()[this.currentMessageIndex()];
        });

        this.arrowImage = ko.computed(() => {
            var state = this.currentMessage().arrowTop ? 'up' : 'down';
            return 'assets/images/arrow_' + state + '.png';
        });

        this.arrowClasses = ko.computed(() => {
            var hor = this.currentMessage().arrowTop ? 'top' : 'bottom';
            var ver = this.currentMessage().arrowLeft ? 'left' : 'right';
            return hor + ' ' + ver;
        });
    }

    public next = () => {
        if (this.currentMessageIndex() === this.messages().length - 1) {
            this.active(false);
        } else {
            this.currentMessageIndex(this.currentMessageIndex() + 1);
        }
    }

    public startTutorial = () => {
        this.active(true);
    }
}

export = new Tutorial();
