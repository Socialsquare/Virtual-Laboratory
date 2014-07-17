define([
    'knockout',
    'base',
    'lodash',
    'model/Popup',
    'utils/TextHelper',

    'controller/Quiz',
    'controller/Video'
], function (ko, Base, _, PopupModel, TextHelper, QuizController, VideoController) {

    var Popup = Base.extend({

        constructor: function () {
            var self = this;

            self.activePopups = ko.observableArray([]);
            self.active = ko.computed(function () {
                return !self.activePopups.isEmpty();
            });

            self.show = function (name, viewData) {
                var vm = new PopupModel(name, viewData, self);
                self.activePopups.push(vm);
                return vm;
            };

            self.hide = function (popup) {
                self.activePopups.remove(popup);
            };

            self.message = function (title, message) {
                self.show('popup-message', { title: title, message: message });
            };

            self.notify = function(title, message, closingTime) {
                var delay = closingTime || 3000;

                var vm = self.show('popup-notify', { title: title, message: message });
                _.delay(function () {
                    self.hide(vm);
                }, delay);
            };

            self.itemDetail = function (item) {
                self.show('popup-item-detail', { item: item });
            };

            self.confirm = function (title, message, cb) {
                var vm = self.show('popup-dialog', { title: title, message: message, cb: function (answer) {
                    cb(answer);
                    self.hide(vm);
                }});
            };

            self.quiz = function (id) {
                self.show('popup-quiz', { quizController: new QuizController(id) });
            };

            self.video = function (sequence) {
                var videoController = new VideoController();
                var vm = self.show('popup-video', { videoController: videoController });
                videoController.play(sequence).done(function () {
                    self.hide(vm);
                });
            };

            self.select = function (title, message, options, cb) {
                var selected = ko.observable();
                var fn = function () {
                    cb(selected());
                    self.hide(vm);
                };

                var vm = self.show('popup-select', { title: title,
                                            message: message,
                                            options: options,
                                            selected: selected,
                                            cb: fn });
            };
        }
    });

    return new Popup();
});
