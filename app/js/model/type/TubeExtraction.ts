import ev = require('enumvalue');

enum TubeExtraction {
    FROM_MOUSE_BLOOD   = ev.next(),
    FROM_CLUMPED_CELLS = ev.next(),
};

export = TubeExtraction;
