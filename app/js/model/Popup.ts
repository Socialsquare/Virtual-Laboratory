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

    print() {
        $("#print-popup").html($(".popup").html());
        window.print();        
    }

    selectedExperiment() {
        return { 'id': 'clamp' }
    }

    discardExperiment () {
        this.hide();
        router.navigate('loading');
    }
}

export = PopupModel;
