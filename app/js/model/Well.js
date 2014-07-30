define([
    'knockout',
    'lodash',
    'base'
], function (ko, _, Base) {
    var Well = Base.extend({

        constructor: function () {
            var self = this;

            self.hasAntibody = ko.observable(false);
            self.hasFluorescentSecondaryAntibody = ko.observable(false);

            //TODO: Dummy data, delete.
            self.hasAntibody(Math.random() > 0.5);
            self.hasFluorescentSecondaryAntibody(Math.random() > 0.5);
        }
    });

    return Well;
});

