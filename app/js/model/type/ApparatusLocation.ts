import ev = require('enumvalue');

enum Apparatus {
    CORNER                  = ev.next(),
    UV_ROOM                 = ev.next(),
    MOUSE_CAGE_GLUCOSE_BAG  = ev.next(),
    MOUSE_CAGE_CLAMP_BOTTLE = ev.next(),
    INCUBATOR_ANTI_MATTER   = ev.next(),
};

export = Apparatus;
