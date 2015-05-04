import ev = require('enumvalue');

enum ComputerScreen {
    MENU        = ev.next(), //        'ComputerScreenType.MENU',
    DESIGN_DNA  = ev.next(), //  'ComputerScreenType.DESIGN_DNA',
    DESIGN_DRUG = ev.next(), // 'ComputerScreenType.DESIGN_DRUG',
    ORDER_MOUSE = ev.next(), // 'ComputerScreenType.ORDER_MOUSE',
    SEQUENCING  = ev.next(), //  'ComputerScreenType.SEQUENCING',
    PROTEIN     = ev.next(), //     'ComputerScreenType.PROTEIN'
};

export = ComputerScreen;
