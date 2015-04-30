import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');

import VideoModel = require('model/Video');
import FeatureHelper = require('utils/FeatureHelper');

var videos = [
    new VideoModel('fast-drink-spawn', 'fast_drink_spawn'),
    /*new VideoModel('drink-loop', 'fast_drink_loop'),*/
    new VideoModel('fast-injection-lethal', 'fast_injection_lethal'),
    new VideoModel('fast-dead-cut', 'fast_dead_cut'),

    // Healthy mouse
    new VideoModel('fast-loop', 'fast_loop'),
    new VideoModel('fast-injection', 'fast_injection'),
    new VideoModel('fast-die-insulin', 'fast_die_insulin'),

    // Mouse with smallpox
    new VideoModel('smallpox-cure', 'smallpox_cure'),
    new VideoModel('smallpox-injection', 'smallpox_injection'),
    new VideoModel('smallpox-loop', 'smallpox_loop'),

    // Mouse with gout
    new VideoModel('slow-cure-gout', 'slow_cure_gout'),
    new VideoModel('slow-injection-body-gout', 'slow_injection_body'),
    new VideoModel('slow-loop-gout', 'slow_loop'),

    // Mouse with psoriasis
    new VideoModel('psoriasis-loop', 'psoriasis_loop'),
    new VideoModel('psoriasis-cure', 'psoriasis_cure'),
    new VideoModel('psoriasis-injection', 'psoriasis_injection'),
    new VideoModel('psoriasis-pill', 'psoriasis_pill'),
    new VideoModel('psoriasis-cream', 'psoriasis_cream'),

    // Mouse with insomnia
    new VideoModel('slow-loop', 'slow_loop'),
    new VideoModel('slow-sleeping', 'slow_sleeping'),
    new VideoModel('slow-wake', 'slow_wake'),
    new VideoModel('slow-cure-insomnia', 'slow_cure_insomnia'),
    new VideoModel('slow-cream', 'slow_cream'),
    new VideoModel('slow-pill', 'slow_pill'),
    new VideoModel('slow-injection-head', 'slow_injection_head'),
    new VideoModel('slow-injection-body', 'slow_injection_body'),
    new VideoModel('slow-injection-body-faint', 'slow_injection_body_faint'),

    // Mousemaps
    new VideoModel('mousemap-pso-blood-inj-body', 'mousemap_pso_blood_inj_body'),
    new VideoModel('mousemap-pso-blood-liver', 'mousemap_pso_blood_liver'),
    new VideoModel('mousemap-pso-liver', 'mousemap_pso_liver'),
    new VideoModel('mousemap-pso-pill-intestine', 'mousemap_pso_pill_intestine'),
    new VideoModel('mousemap-pso-skin', 'mousemap_pso_skin'),

    // Drug-journeys
    new VideoModel('drug-barrier-failure', 'drug_barrier_failure'),
    new VideoModel('drug-barrier-success', 'drug_barrier_success'),
    new VideoModel('drug-blood-failure', 'drug_blood_failure'),
    new VideoModel('drug-blood-success', 'drug_blood_success'),
    new VideoModel('drug-liver-changed', 'drug_liver_changed'),
    new VideoModel('drug-liver-changed-grey', 'drug_liver_changed_grey'),
    new VideoModel('drug-liver-unchanged', 'drug_liver_unchanged'),
    new VideoModel('drug-target-failure', 'drug_target_failure'),
    new VideoModel('drug-target-success', 'drug_target_success'),


    new VideoModel('electroporator1', 'electroporator01'),
    new VideoModel('electroporator2', 'electroporator02'),
    new VideoModel('electroporator3', 'electroporator03'),
    new VideoModel('electroporator4', 'electroporator04'),
    new VideoModel('electroporator5', 'electroporator05'),
    new VideoModel('electroporator6', 'electroporator06'),
    new VideoModel('electroporator7', 'electroporator07')
];

var timeout = 2000;

class VideoController {

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
    }

    public findVideo = (id) => {
        var video = _.find(videos, v => v.name() === id);
        if (!video)
            throw 'Unknown video: ' + id;

        return video;
    }

    public play = (_ids: string | string[], loopLast = false, controlsRequired = false) => {
        this.controlsRequired(controlsRequired);
        this.promise = $.Deferred();

        var ids: string[];

        // TODO! smells bad
        if (typeof _ids === 'string')
            ids = [_ids];
        else
            ids = _ids

        this.isLooping(false);

        this.loopLastInQueue(loopLast);

        this.queue(ids);

        this.consumeQueue();

        return this.promise;
    }

    public stop = () => {
        this.activeVideo(null);
    }

    public consumeQueue = () => {
        var id = this.queue.shift();

        if (this.queue().length === 0 && this.loopLastInQueue()) {
            this.isLooping(true);
        }

        // force removal of the video tag before inserting the new one
        this.activeVideo(null);
        this.activeVideo(this.findVideo(id));

        // force handleVideoEnd if fallback image
        if (this.enableFallback)
            setTimeout(this.handleVideoEnd, timeout);
    }

    public handleVideoEnd = () => {
        if (this.queue.isEmpty())
            this.promise.resolve();
        else
            this.consumeQueue();
    }
}

export = VideoController;
