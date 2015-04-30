import ko = require('knockout');

class Video {

    public name: KnockoutObservable<string>;
    public filePath: KnockoutObservable<string>;
    //public timeout: KnockoutObservable<number>;

    constructor(name, filePath) {
        this.name = ko.observable(name);
        this.filePath = ko.observable(filePath);
        //this.timeout = ko.observable(timeout);
    }
}

export = Video;
