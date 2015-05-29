import ko = require('knockout');

class Video {

    public name: KnockoutObservable<string>;
    public filePath: KnockoutObservable<string>;

    constructor(name, filePath) {
        this.name = ko.observable(name);
        this.filePath = ko.observable(filePath);
    }
}

export = Video;
