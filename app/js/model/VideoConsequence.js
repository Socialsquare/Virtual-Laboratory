define([
    'knockout',
    'model/Consequence',
    'model/type/Consequence'
], function (ko, ConsequenceModel, ConsequenceType) {
    var VideoConsequence = ConsequenceModel.extend({
        constructor: function (video) {
            var self = this;
            self.base(ConsequenceType.VIDEO);
            self.video = video;
        }
    });

    return VideoConsequence;
});
