import ev = require('enumvalue');

enum Apparatus {
    CORNER_SPECTRO          = ev.next(),
    CORNER_FOOBAR           = ev.next(),

    UV_ROOM_GEL             = ev.next(),
    UV_ROOM_MICROTITER      = ev.next(),
    GLUCOSE_BAG             = ev.next(),
    VET_MONITOR             = ev.next(),
    VET_MONITOR_WITH_GIR    = ev.next(),
};

export = Apparatus;
