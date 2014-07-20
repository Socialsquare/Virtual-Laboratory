define([
    'knockout',
    'lodash',
    'utils/utils',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, _, utils, SimpleContainerModel, ContainerType) {

    var Syringe = SimpleContainerModel.extend({

        constructor: function () {
            var self = this;
            self.base(ContainerType.SYRINGE, Math.pow(10,13));

            self.fillSyringe = function(container) {
// 1st modify the syringe
                /*var cloned_liqs = utils.klone(container.liquids);*/
                var cloned_liqs = _.invoke(container.liquids(), 'clone');
                /*var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);*/
                var modified_liqs = utils.biology.dilute(50, cloned_liqs);
                self.addAll(modified_liqs);

// 2nd modify the container
                modified_liqs = utils.biology.dilute(50/49, container.liquids());
                container.clearContents();
                container.addAll(modified_liqs);
            };

            self.emptySyringeInto = function(container) {
                var cloned_liqs = _.invoke(self.liquids(), 'clone');
                container.addAll(cloned_liqs);
                self.clearContents();
            };
        }
    });

    return Syringe;
});
