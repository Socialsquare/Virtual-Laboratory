import _ = require('lodash');

class FeatureHelper {

    static autoPlayPlatforms = [ 'iPad', 'iPhone', 'iPod', 'Android' ];
    static homeScreenPlatforms = [ 'iPad', 'iPhone' ];

    static autoPlay = !_.contains(FeatureHelper.autoPlayPlatforms,
                                  navigator.platform);

    static homeScreen = _.contains(FeatureHelper.homeScreenPlatforms,
                                   navigator.platform);
}

export = FeatureHelper;
