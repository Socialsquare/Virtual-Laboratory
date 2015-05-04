import ev = require('enumvalue');

enum Mouse {
    HEALTHY   = ev.next(), // 'MouseType.HEALTHY',
    GOUT      = ev.next(), // 'MouseType.GOUT',
    SMALLPOX  = ev.next(), // 'MouseType.SMALLPOX',
    INSOMNIA  = ev.next(), // 'MouseType.INSOMNIA',
    PSORIASIS = ev.next(), // 'MouseType.PSORIASIS'
}

export = Mouse;
