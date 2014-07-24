define([
    'base',
    'lodash'
], function (Base, _) {

    var Feature = Base.extend({

        constructor: function () {
            var self = this;

            var autoPlayPlatforms = [ 'iPad', 'iPhone', 'iPod', 'Android' ];
            self.autoPlay = !_.contains(autoPlayPlatforms, navigator.platform);

            var homeScreenPlatforms = [ 'iPad', 'iPhone' ];
            self.homeScreen = _.contains(homeScreenPlatforms, navigator.platform);
        }
    });

    return new Feature();
});
