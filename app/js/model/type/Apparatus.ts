import ev = require('enumvalue');

enum Apparatus {
    CORNER_SPECTRO          = ev.next(),
    CORNER_FOOBAR           = ev.next(),

    UV_ROOM_GEL             = ev.next(),
    UV_ROOM_MICROTITER      = ev.next(),
    GLUCOSE_BAG             = ev.next(),
    VET_MONITOR_EX_GL_GIR   = ev.next(),
    VET_MONITOR_EX_GL_HR    = ev.next(),
};

export = Apparatus;
