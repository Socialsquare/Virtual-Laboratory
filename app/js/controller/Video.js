define([
    'knockout',
    'jquery',
    'lodash',
    'base',

    'model/Video'
], function (ko, $, _, Base, VideoModel) {

    var videos = [
        new VideoModel('fast-drink-spawn', 'fast_drink_spawn'),
        /*new VideoModel('drink-loop', 'fast_drink_loop'),*/
        new VideoModel('fast-injection-lethal', 'fast_injection_lethal'),
        new VideoModel('fast-dead-cut', 'fast_dead_cut'),

        // Healthy mouse
        new VideoModel('fast-loop', 'fast_loop'),
        new VideoModel('fast-injection', 'fast_injection'),
        new VideoModel('fast-die-insulin', 'fast_die_insulin'), //TODO:

        // Mouse with smallpox
        new VideoModel('smallpox-cure', 'smallpox_cure'),
        new VideoModel('smallpox-injection', 'smallpox_injection'),
        new VideoModel('smallpox-loop', 'smallpox_loop'),

        // Mouse with gout
        new VideoModel('slow-cure-gout', 'slow_cure_gout'),
        new VideoModel('slow-injection-body-gout', 'slow_injection_body'),
        new VideoModel('slow-loop-gout', 'slow_loop'),

        // Mouse with psoriasis //TODO:
        new VideoModel('psoriasis-loop', 'psoriasis_loop'),
        new VideoModel('psoriasis-cure', 'psoriasis_cure'),
        new VideoModel('psoriasis-injection', 'psoriasis_injection'),
        new VideoModel('psoriasis-pill', 'psoriasis_pill'),
        new VideoModel('psoriasis-cream', 'psoriasis_cream'),

        // Mouse with insomnia //TODO:
        new VideoModel('slow-loop', 'slow_loop'),
        new VideoModel('slow-sleeping', 'slow_sleeping'),
        new VideoModel('slow-wake', 'slow_wake'),
        new VideoModel('slow-cure-insomnia', 'slow_cure_insomnia'),
        new VideoModel('slow-cream', 'slow_cream'),
        new VideoModel('slow-pill', 'slow_pill'),
        new VideoModel('slow-injection-head', 'slow_injection_head'),
        new VideoModel('slow-injection-body', 'slow_injection_body'),
        new VideoModel('slow-injection-body-faint', 'slow_injection_body_faint'),


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
                var video = _.find(videos, function (v) { return v.name() === id; });
                if (!video)
                    throw 'Unknown video: ' + id;

                return video;
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
