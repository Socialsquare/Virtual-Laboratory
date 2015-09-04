import ev = require('enumvalue');

enum Apparatus {
    CORNER_SPECTRO     = ev.next(),
    CORNER_FOOBAR      = ev.next(),

    UV_ROOM_GEL        = ev.next(),
    UV_ROOM_MICROTITER = ev.next(),
    GLUCOSE_BAG        = ev.next(),
};

export = Apparatus;
