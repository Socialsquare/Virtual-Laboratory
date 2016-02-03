import ev = require('enumvalue');

enum Apparatus {
    CORNER_SPECTRO          = ev.next(),
    CORNER_FOOBAR           = ev.next(),

    UV_ROOM_GEL             = ev.next(),
    UV_ROOM_MICROTITER      = ev.next(),
    GLUCOSE_BAG_CLAMP       = ev.next(),
    FF_BOTTLE               = ev.next(),
    VET_MONITOR             = ev.next(),
    INCUBATOR_ANTI_MATTER   = ev.next(),
};

export = Apparatus;
