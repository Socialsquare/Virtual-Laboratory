import ev = require('enumvalue');

enum ComputerScreen {
    MENU        = ev.next(),
    DESIGN_DNA  = ev.next(),
    DESIGN_DRUG = ev.next(),
    ORDER_MOUSE = ev.next(),
    SEQUENCING  = ev.next(),
    PROTEIN     = ev.next(),
};

export = ComputerScreen;
