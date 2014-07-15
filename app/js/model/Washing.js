define([
    'knockout',
    'lodash',
    'base',

    'model/WashingTank',
    'model/TubeRack',

    'model/type/Liquid'

], function(ko, _, Base, WashingTankModel, TubeRackModel, LiquidType) {

    var Washing = Base.extend({

        constructor: function () {
            var self = this;

            self.agents = ko.observableArray([]);

            self.action = function (concentration) {
                console.log('TODO: implement proper washing action');

                var result = 0;
                var feedback = '';

                // check if agents contain other stuff
                var indexOfOther = _.findIndex(self.agents(), function(agent) {
                    return agent.type() != LiquidType.LIPASE_ENZYME;
                });

                if (indexOfOther < 0) {
                    // do not return 0
                    result = 0.1;
                } else {
                    result = 0.9;
                    feedback = 'Din prøvde var forurenet';
                }

                return { result: result, feedback: feedback };
            };

            // TODO: remove?
            // self.washingTank = new WashingTankModel();

            self.tubeRack = new TubeRackModel();
        }
    });

    return Washing;
});
