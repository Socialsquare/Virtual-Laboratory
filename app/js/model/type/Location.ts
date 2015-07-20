import ev = require('enumvalue');

enum Location {
    CHEMICAL        = ev.next(),
    COMPUTER        = ev.next(),
    FERMENTOR       = ev.next(),
    FERMENTORSCREEN = ev.next(),
    FUMEHOOD        = ev.next(),
    INCUBATOR       = ev.next(),
    LOADING         = ev.next(),
    MOUSE           = ev.next(),
    OVERVIEW        = ev.next(),
    SPECTROPM       = ev.next(),
    SPECTROPMSCREEN = ev.next(),
    UVROOM          = ev.next(),
    WASHING         = ev.next(),
    WORKTABLE1      = ev.next(),
    WORKTABLE2      = ev.next(),
    WORKTABLE3      = ev.next(),
    INVENTORY       = ev.next(),
    ICE_BATH        = ev.next(),
    HEATER          = ev.next(),
}

export = Location;
