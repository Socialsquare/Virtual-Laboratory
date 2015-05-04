import ev = require('enumvalue');

enum Administration {
    INJECTION_HEAD = ev.next(), // 'AdministrationType.INJECTION_HEAD',
    INJECTION_BODY = ev.next(), // 'AdministrationType.INJECTION_BODY',
    PILL           = ev.next(), // 'AdministrationType.INJECTION_PILL',
    CREAM          = ev.next(), // 'AdministrationType.INJECTION_CREAM'
};

export = Administration;
