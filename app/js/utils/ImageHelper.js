define([
    'lodash',
    'base',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem',
    'model/type/Location'

], function (_, Base, ContainerType, LiquidType, SpecialItemType, LocationType) {

    var ImageHelper = Base.extend({
        constructor: function () {
            var self = this;
            self.imageRoot = 'assets/images';

            self.img = function (path) {
                return self.imageRoot + '/' + path;
            };

            self.emptyFull = function (prefix) {
                return function (position, container) {
                    var state = !container || container.isEmpty() ? 'empty' : 'full';
                    return self.img(prefix + (position + 1) + '_' + state + '.png');
                };
            };

            self.single = function (prefix) {
                return function (position, container) {
                    return self.img(prefix + (position + 1) + '.png');
                };
            };

            self.incubatorTubeImage = self.emptyFull('incubator_tube');
            self.incubatorPetriImage = self.emptyFull('incubator_dish');
            self.tubeRackImage = self.emptyFull('tube');

            self.heaterTubeImage = self.single('work1-heater_');
            self.tableSpaceMicroImage = self.single('micro');
            self.uvTableSpaceMicroImage = self.single('uv_micro');
            self.sidegroupEmptySlot = self.single('scaffold_R');

            self.odMachineTubeImage = _.constant(self.img('work2_od-on.png'));

            self.tableSpacePetriImage = function (position, petri) {
                var state = !petri || petri.isEmpty() ? 'empty' : 'full';
                return self.img('petri_' + state + '.png');
            };

            self.uvTubeRackImage = function (position, tube) {
                var state = tube.isEmpty() ? 'empty' : (tube.isFluorescent() ? 'glow' : 'full');
                return self.img('uv_tube' + (position + 1) + '_' + state + '.png');
            };

            self.uvTableSpacePetriImage = function (position, dish) {
                var state = !dish || dish.isEmpty() ? 'empty' : (dish.isFluorescent() ? 'glow' : 'full');
                return self.img('uv_petri' + (position + 1) + '_' + state + '.png');
            };

            self.scaffoldImage = function (name) {
                return self.img('scaffold_' + name + '.png');
            };

            self.sidegroupImage = function (name) {
                return self.img('sidegroup_' + name + '.png');
            };

            self.microtiterWell = function(index, microtiter) {

                if (microtiter.location() === LocationType.UVROOM) {
                    if (microtiter.isWellFluorescent(index)) {
                        return self.img('zoom_mkrt_well_uv_glow.png')
                    }else {
                        return self.img('zoom_mkrt_well_uv_full.png')
                    }
                }
                return self.img('zoom_mkrt_well_dense.png');
            };

            self.inventoryIcon = function (item) {
                switch (item.type()) {
                case ContainerType.PETRI_DISH:
                    return self.img('icon_cup_petri.png');

                case ContainerType.MICROTITER:
                    return self.img('icon_cup_mkrt.png');

                case ContainerType.TUBE:
                    return self.img('icon_cup_tube.png');

                case ContainerType.SYRINGE:
                    return self.img('icon_med_inj.png');

                case SpecialItemType.SCALPEL:
                    return self.img('icon_scalpel.png');

                case SpecialItemType.SPLEEN:
                    return self.img('icon_spleen.png');

                case SpecialItemType.BUFFER:
                    return self.img('icon_wash_bottle.png');

                case SpecialItemType.WASH_BOTTLE:
                    return self.img('icon_wash_bottle.png');

                default:
                    throw 'Unknown inventory item: ' + item.type();
                }
            };

            self.draggingIcon = function (item) {
                switch (item.type()) {
                case ContainerType.PETRI_DISH:
                    return self.img('icon_cup_petri.png');

                case ContainerType.MICROTITER:
                    return self.img('icon_cup_mkrt.png');

                case ContainerType.TUBE:
                    return self.img('icon_cup_tube.png');

                case ContainerType.BOTTLE:
                    return self.img('grab_drink.png');

                case LiquidType.DNA:
                    return self.img('icon_cup_tube.png');

                case ContainerType.SYRINGE:
                    return self.img('icon_med_inj.png');

                case SpecialItemType.SPLEEN:
                    return self.img('icon_spleen.png');

                case SpecialItemType.SCALPEL:
                    return self.img('icon_scalpel.png');

                case SpecialItemType.BUFFER:
                    return self.img('icon_wash_bottle.png');

                case SpecialItemType.WASH_BOTTLE:
                    return self.img('icon_wash_bottle.png');

                default:
                    throw 'Unknown dragging item: ' + item.type();
                }
            };
        }
    });

    return new ImageHelper();
});
