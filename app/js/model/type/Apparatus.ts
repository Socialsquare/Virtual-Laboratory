import ev = require('enumvalue');

enum Apparatus {
    CORNER_SPECTRO          = ev.next(),
    CORNER_FOOBAR           = ev.next(),

    UV_ROOM_GEL             = ev.next(),
    UV_ROOM_MICROTITER      = ev.next(),
    GLUCOSE_BAG_CLAMP       = ev.next(),
    CLAMP_JUICE_BOTTLE      = ev.next(),
    VET_MONITOR             = ev.next(),
};

export = Apparatus;
