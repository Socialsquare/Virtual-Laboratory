define([
    'utils/mouse/BottleHandler',
    'utils/mouse/ScalpelHandler',
    'utils/mouse/SyringeHandler',
    'utils/mouse/TubeHandler',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function (BottleHandler, ScalpelHandler, SyringeHandler, TubeHandler,
             ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {
    return {
        handleDrop: function(MC, item) { //MC = MouseController

            if(MC.mouse().isInteracting())
                return false;

            //TODO: decision tree based on 1st item, 2nd mouseType
            switch(item.type()) {
                case ContainerType.BOTTLE:
                    return BottleHandler.handle(MC, item);

                case SpecialItemType.SCALPEL:
                    return ScalpelHandler.handle(MC, item);

                case ContainerType.SYRINGE:
                    return SyringeHandler.handle(MC, item);

                case ContainerType.TUBE:
                    return TubeHandler.handle(MC, item);

            }
        }
    };
});
