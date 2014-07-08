define([
    'knockout',
    'base'
], function (ko, Base) {
    var TubeRackModel = Base.extend({
        constructor: function () {
            this.tubes = ko.observableArray(new Array(6));
        },

        add: function (tube, position) {
            var self = this;

            if (!!self.get(position)) {
                return false;
            }

            self.tubes.setAt(position, tube);
            return true;
        },

        get: function (position) {
            var self = this;
            return self.tubes()[position];
        },

        remove: function (position) {
            var self = this;
            self.tubes.setAt(position, null);
        },

        // utils TODO: maybe move elsewhere
        tubeImage: function (position, tube) {
            if (!tube) return '';
            var state = tube.content().hasContent() ? 'full' : 'empty';
            return 'img/worktable1_testtube_' + position + '_' + state + '.png';
        }
    });

    return TubeRackModel;
});
