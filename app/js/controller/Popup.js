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

            self.active = ko.observable(false);
            self.templateName = ko.observable('');
            self.viewModel = ko.observable(null);

            self.show = function (name, viewData) {
                var vm = new PopupModel(viewData, this);

                self.templateName(name);
                self.viewModel(vm);
                self.active(true);
            };

            self.hide = function () {
                self.active(false);
                self.templateName('');
                self.viewModel(null);
            };

            self.message = function (title, message) {
                self.show('popup-message', { title: title, message: message });
            };

            self.notify = function(title, message, closingTime) {
                var delay = closingTime || 3000;

                self.show('popup-notify', { title: title, message: message });
                _.delay(function () {
                    self.hide();
                }, delay);
            };

            self.itemDetail = function (item) {
                self.show('popup-item-detail', { item: item });
            };

            self.confirm = function (title, message, cb) {
                self.show('popup-dialog', { title: title, message: message, cb: function (answer) {
                    cb(answer);
                    self.hide();
                } });
            };

            self.quiz = function (id) {
                self.show('popup-quiz', { quizController: new QuizController(id) });
            };

            self.video = function (sequence) {
                var videoController = new VideoController();
                self.show('popup-video', { videoController: videoController });
                videoController.play(sequence).done(function () {
                    self.hide();
                });
            };

            self.select = function (title, message, options, cb) {
                var selected = ko.observable();
                var fn = function () {
                    cb(selected());
                    self.hide();
                };

                self.show('popup-select', { title: title,
                                            message: message,
                                            options: ko.observableArray(options),
                                            selected: selected,
                                            cb: fn });
            };
        }
    });

    return new Popup();
});
