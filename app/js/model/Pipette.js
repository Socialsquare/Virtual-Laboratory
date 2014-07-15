define([
    'knockout',
    'utils/utils',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, utils, CompositeContainerModel, ContainerType) {

    var Pipette = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.PIPETTE_TIP, ContainerType.PIPETTE);

            self.active = ko.observable(false);

            self.hasTip = function () {
                return self.hasContainerAt(0);
            };

            self.getTip = function() {
                return self.get(0);
            };

            self.removeTip = function () {
                self.remove(0);
            };

            self.emptyPipetteInto = function(container) { //TODO: implement
                var cloned_liqs = utils.klone(self.getTip().liquids);

                container.addAll(cloned_liqs());
                self.getTip().clearContents();
            };

            self.fillPipette = function(container) { // TODO: dilute the contents of the container
                var cloned_liqs = utils.klone(container.liquids);
                var modified_liqs = utils.biology.dilute(20, cloned_liqs); //TODO: is this the correct factor?

                self.getTip().addAll(modified_liqs());

                if(!modified_liqs.isEmpty()) {  self.getTip().used(true); }
            };

            self.isEmpty = ko.computed(function () {
                if (!self.hasTip())
                    return false;

                return self.get(0).isEmpty();
            });
        }
    });

    return Pipette;
});
