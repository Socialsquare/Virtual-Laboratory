import ko = require('knockout');
import $ = require('jquery');

import VideoModel = require('model/Video');
import FeatureHelper = require('utils/FeatureHelper');

import videoData = require('json!datadir/videos.json');


class VideoController {
    // Used for testing TODO! could be nicer
    static autoFinish: boolean = false;

    // timeout for videos presented as fallback images
    private timeout = 2000;

    public FeatureHelper: FeatureHelper;
    public enableFallback: boolean;

    public activeVideo: KnockoutObservable<VideoModel>;
    public isLooping: KnockoutObservable<boolean>;
    public loopLastInQueue: KnockoutObservable<boolean>;

    public queue: KnockoutObservableArray<string>;
    public controlsRequired: KnockoutObservable<boolean>;
    public promise: JQueryDeferred<any>;

    constructor(enableFallback = false) {

        this.FeatureHelper = FeatureHelper;
        this.enableFallback = enableFallback && !FeatureHelper.autoPlay;

        this.activeVideo = ko.observable(null);
        this.isLooping = ko.observable(false);
        this.loopLastInQueue = ko.observable(false);

        this.queue = ko.observableArray([]);
        this.controlsRequired = ko.observable(false);
        this.promise = null;

        ko.rebind(this);
    }

    findVideo(id: string) {
        var videoPath = videoData[id];
        if (!videoPath)
            throw 'Unknown video: ' + id;

        return new VideoModel(id, videoPath);
    }

    play(_ids: string | string[], loopLast = false, controlsRequired = false) {
        this.controlsRequired(controlsRequired);
        this.promise = $.Deferred();

        if (VideoController.autoFinish) {
            this.promise.resolve();
            return this.promise;
        }

        var ids: string[];

        // TODO! smells bad
        if (typeof _ids === 'string')
            ids = [_ids];
        else
            ids = _ids;

        this.isLooping(false);

        this.loopLastInQueue(loopLast);

        this.queue(ids);

        this.consumeQueue();

        return this.promise;
    }

    stop() {
        if (this.promise)
            this.promise.resolve();
        this.activeVideo(null);
    }

    consumeQueue() {
        var id = this.queue.shift();

        if (this.queue().length === 0 && this.loopLastInQueue()) {
            this.isLooping(true);
        }

        // force removal of the video tag before inserting the new one
        this.activeVideo(null);
        this.activeVideo(this.findVideo(id));

        // force handleVideoEnd if fallback image
        if (this.enableFallback)
            setTimeout(this.handleVideoEnd, this.timeout);
    }

    handleVideoEnd() {
        if (this.queue.isEmpty())
            this.promise.resolve();
        else
            this.consumeQueue();
    }
}

export = VideoController;
