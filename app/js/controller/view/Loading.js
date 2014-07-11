define([
    'knockout',
    'controller/view/Base',
    'controller/Router'
], function (ko, BaseViewController, router) {

    var Loading = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('loading');

            self.percent = ko.observable(0);

            $.html5Loader({
                filesToLoad: '../../assets/preload.json',
                // debugMode: true,
                onUpdate: function (progress) { self.percent(progress); },
                onComplete: function () {
                    setTimeout(function () { router.navigate('overview'); }, 500);
                }
            });
        },
    });

    return Loading;
});
