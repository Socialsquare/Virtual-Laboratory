define([
    'knockout',
    'base',
    'json!datadir/tutorial.json'
], function (ko, Base, tutorialData) {
    var Tutorial = Base.extend({
        constructor: function () {
            var self = this;

            self.active = ko.observable(false);

            // hardcoded tutorial box positions
            self.messages = ko.observableArray(tutorialData);

            self.currentMessageIndex = ko.observable(0);
            self.currentMessage = ko.computed(function () {
                return self.messages()[self.currentMessageIndex()];
            });

            self.arrowImage = ko.computed(function () {
                var state = self.currentMessage().arrowTop ? 'up' : 'down';
                return 'assets/images/arrow_' + state + '.png';
            });

            self.arrowClasses = ko.computed(function () {
                var hor = self.currentMessage().arrowTop ? 'top' : 'bottom';
                var ver = self.currentMessage().arrowLeft ? 'left' : 'right';
                return hor + ' ' + ver;
            });

            self.next = function () {
                if (self.currentMessageIndex() === self.messages().length - 1) {
                    self.active(false);
                } else {
                    self.currentMessageIndex(self.currentMessageIndex() + 1);
                }
            };

            self.startTutorial = function () {
                self.active(true);
            };
        }
    });

    return new Tutorial();
});
