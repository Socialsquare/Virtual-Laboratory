define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController) {

    var Loading = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('loading');
            self.hasMenu(false);

            self.percent = ko.observable(0);

            $.html5Loader({
                filesToLoad: '../../assets/preload.json',
                // debugMode: true,
                onUpdate: function (progress) { self.percent(progress); },
                onComplete: function () {
                    setTimeout(function () { self.router.navigate('welcome'); }, 500);
                }
            });
        },
    });

    return Loading;
});
