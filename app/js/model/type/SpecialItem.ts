import ev = require('enumvalue');

enum SpecialItem {
    SCALPEL        = ev.next(), // 'SpecialItemType.SCALPEL',
    SPLEEN         = ev.next(), // 'SpecialItemType.SPLEEN',
    BUFFER         = ev.next(), // 'SpecialItemType.BUFFER',
    WASH_BOTTLE    = ev.next(), // 'SpecialItemType.WASH_BOTTLE',
    SIDEGROUP      = ev.next(), // 'SpecialItemType.SIDEGROUP',
    SIDEGROUP_SLOT = ev.next(), // 'SpecialItemType.SIDEGROUP_SLOT'
    MOUSE          = ev.next()  // 'SpecialItemType.MOUSE',
}

export = SpecialItem;
