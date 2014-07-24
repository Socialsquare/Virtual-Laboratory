define([
    'knockout',
    'base'
], function (ko, Base) {
    var Tutorial = Base.extend({
        constructor: function () {
            var self = this;

            self.active = ko.observable(false);

            // hardcoded tutorial box positions
            self.messages = ko.observableArray([
                {
                    title: "Hej",
                    message: "Her er fedt",
                    x: 100,
                    y: 200,
                    arrowTop: true,
                    arrowLeft: true
                },
                {
                    title: "Such doge",
                    message: "Lorem upsum oa alof jao lak nifa",
                    x: 400,
                    y: 50,
                    arrowTop: false,
                    arrowLeft: true
                },
                {
                    title: "Det var det",
                    message: "Held og lykke",
                    x: 500,
                    y: 400,
                    arrowTop: false,
                    arrowLeft: false
                }
            ]);

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
