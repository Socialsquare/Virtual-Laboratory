define([
    'knockout',
    'base',
    'model/TubeRack'
], function(ko, Base, TubeRackModel) {

    var Washing = Base.extend({
        constructor: function () {
            var self = this;

            // TODO: This is a special case, as the tubes are not allowed to leave the room
            /*self.tubeRack = new TubeRackModel();*/
        }
    });

    return Washing;
});

