import ev = require('enumvalue');

enum Trigger {
    MIX        = ev.next(), // 'TriggerType.MIX',
    MOUSE      = ev.next(), // 'TriggerType.MOUSE',
    ACTIVATION = ev.next(), // 'TriggerType.ACTIVATION',
    ACQUIRE    = ev.next(), // 'TriggerType.ACQUIRE'
}

export = Trigger;
