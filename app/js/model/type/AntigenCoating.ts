import ev = require('enumvalue');

enum AntigenCoating {
    ANY = ev.next(), // 'AntigenCoatingType.ANY',
    NONE = ev.next(), // 'AntigenCoatingType.NONE'
};

export = AntigenCoating;
