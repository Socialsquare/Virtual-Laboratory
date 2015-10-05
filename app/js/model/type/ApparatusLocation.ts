import ev = require('enumvalue');

enum Apparatus {
    CORNER                 = ev.next(),
    UV_ROOM                = ev.next(),
    MOUSE_CAGE_GLUCOSE_BAG = ev.next(),
    MOUSE_CAGE_VET_MONITOR = ev.next(),
};

export = Apparatus;
