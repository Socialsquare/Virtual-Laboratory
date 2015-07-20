import ev = require('enumvalue');

enum Trigger {
    MIX        = ev.next(),
    MOUSE      = ev.next(),
    ACTIVATION = ev.next(),
    ACQUIRE    = ev.next(),
}

export = Trigger;
