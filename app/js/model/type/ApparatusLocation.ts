import ev = require('enumvalue');

enum Apparatus {
    CORNER     = ev.next(),
    UV_ROOM    = ev.next(),
    MOUSE_CAGE = ev.next(),
    MOUSE_CAGE_VET_MONITOR = ev.next(),
};

export = Apparatus;
