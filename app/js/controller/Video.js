define([
    'knockout',
    'jquery',
    'lodash',
    'base',

    'model/Video'
], function (ko, $, _, Base, VideoModel) {

    var videos = [
        new VideoModel('run', 'runFast'),
        new VideoModel('drink-start', 'runFast_drink_spawn'),
        new VideoModel('drink-loop', 'runFast_drink_loop'),
        new VideoModel('injection-run', 'runFast_inj'),
        new VideoModel('injection-die', 'poi1_inj'),
        new VideoModel('cut', 'poi3_cut'),
        new VideoModel('injection-cure-smallpox', 'runSlow_cure_pox'),
        new VideoModel('injection-smallpox', 'runSlow_inj_pox'),
        new VideoModel('run-slow', 'runSlow_pox'),

        new VideoModel('electroporator1', 'electroporator01'),
        new VideoModel('electroporator2', 'electroporator02'),
        new VideoModel('electroporator3', 'electroporator03'),
        new VideoModel('electroporator4', 'electroporator04'),
        new VideoModel('electroporator5', 'electroporator05'),
        new VideoModel('electroporator6', 'electroporator06'),
        new VideoModel('electroporator7', 'electroporator07')
    ];

    var VideoController = Base.extend({
        constructor: function () {
            var self = this;

            self.activeVideo = ko.observable(null);
            self.isLooping = ko.observable(false);
            self.loopLastInQueue = ko.observable(false);

            self.queue = ko.observableArray();

            self.promise = null;

            self.findVideo = function (id) {
                return _.find(videos, function (v) { return v.name() === id; });
            };

            self.play = function (ids, loopLast) {
                self.promise = $.Deferred();

                if (!_.isArray(ids))
                    ids = [ids];

                self.isLooping(false);

                self.loopLastInQueue(loopLast);

                self.queue(ids);

                self.consumeQueue();

                return self.promise;
            };

            self.stop = function () {
                self.activeVideo(null);
            };

            self.consumeQueue = function () {
                var id = self.queue.shift();

                if (self.queue().length === 0 && self.loopLastInQueue()) {
                    self.isLooping(true);
                }

                // force removal of the video tag before inserting the new one
                self.activeVideo(null);
                self.activeVideo(self.findVideo(id));
            };

            self.handleVideoEnd = function () {
                if (self.queue.isEmpty())
                    self.promise.resolve();
                else
                    self.consumeQueue();
            };
        }
    });

    return VideoController;
});
