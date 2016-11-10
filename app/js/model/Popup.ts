import ko = require('knockout');
import $ = require('jquery');

import ImageHelper = require('utils/ImageHelper');
import TextHelper = require('utils/TextHelper');
import router = require('controller/Router');

class PopupModel {

    public ImageHelper = ImageHelper;
    public TextHelper = TextHelper;

    public templateName: string;
    public data: any;
    public isNotification: boolean;

    public closePromise: JQueryDeferred<any>;

    constructor(templateName: string, data = null, isNotification = false) {
        this.data = data;
        this.templateName = templateName;
        this.isNotification = isNotification;

        this.closePromise = $.Deferred();

        ko.rebind(this);
    }

    postRender() {
        // noop
    }

    //TODO! this should be using signals (http://millermedeiros.github.io/js-signals)
    resetPromise() {
        this.closePromise = $.Deferred();
    }

    hide() {
        this.closePromise.resolve();
    }

    onBeforeOpen () {}

    isVisible() {
      return Boolean(this.closePromise) && this.closePromise.state() === 'pending';
    }

    print() {
        var isFs = screenfull.enabled && screenfull.isFullscreen;
        if (isFs) {
            var body = document.getElementsByTagName('body')[0];
            screenfull.exit(body);
        }
        $('#print-popup').html($('.popup').html());
        window.print();
        if (isFs && !screenfull.isFullscreen){
            var body = document.getElementsByTagName('body')[0];
            screenfull.toggle(body);
        }
    }

    selectedExperiment() {
        return { 'id': 'clamp' };
    }
}

export = PopupModel;
