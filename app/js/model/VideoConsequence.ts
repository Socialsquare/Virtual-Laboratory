import ko = require('knockout');

import ConsequenceType = require('model/type/Consequence');

import ConsequenceModel = require('model/Consequence');


class VideoConsequence extends ConsequenceModel {

    public video: string;

    constructor(video) {
        super(ConsequenceType.VIDEO);

        this.video = video;
    }
}

export = VideoConsequence;
