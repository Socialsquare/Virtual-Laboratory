import ev = require('enumvalue');

enum SpecialItem {
    SCALPEL        = ev.next(),
    SPLEEN         = ev.next(),
    BUFFER         = ev.next(),
    WASH_BOTTLE    = ev.next(),
    SIDEGROUP      = ev.next(),
    SIDEGROUP_SLOT = ev.next(),
    MOUSE          = ev.next(),
    GEL            = ev.next(),
}

export = SpecialItem;
