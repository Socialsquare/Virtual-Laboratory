import $ = require('jquery');
import ko = require('knockout');

ko.bindingHandlers.videoLoop = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var loop = valueAccessor();

        if (loop) {
            $(element).on('ended', function () {
                this.play();
            });
            var videoTag = <HTMLVideoElement>$(element).get(0);
            videoTag.play();
        } else {
            $(element).off('ended');
        }
    }
};
