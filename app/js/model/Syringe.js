define([
    'knockout',
    'utils/utils',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, utils, SimpleContainerModel, ContainerType) {

    var Syringe = SimpleContainerModel.extend({

        constructor: function () {
            var self = this;
            self.base(ContainerType.SYRINGE, Math.pow(10,13));

            self.fillSyringe = function(container) { // TODO: dilute the container slightly
// 1st modify the syringe
                var cloned_liqs = utils.klone(container.liquids);
                var modified_liqs = utils.biology.dilute(50, cloned_liqs);
                self.addAll(modified_liqs());

// 2nd modify the container
                modified_liqs = utils.biology.dilute(50/49, container.liquids);
                container.clearContents();
                container.addAll(modified_liqs());
            };

            self.emptySyringeInto = function(container) {
                //TODO: doesn't work.
                var cloned_liqs = utils.klone(self.liquids);

                container.addAll(cloned_liqs());
                self.clearContents();
                debugger;
            };
        }
    });

    return Syringe;
});
