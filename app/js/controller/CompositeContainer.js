define([
    'knockout',
    'base'
], function (Base, ko) {

    var CompositeContainerUIController = Base.extend({

        constructor: function (collection, imageGetter, accepter, idPrefix, cssClass) {
            var self = this;

            self.collection = collection;
            self.imageGetter = imageGetter;
            self.accepter = accepter;
            self.idPrefix = idPrefix;
            self.cssClass = cssClass;
        }
    });
});
