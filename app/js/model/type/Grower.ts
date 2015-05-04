import ev = require('enumvalue');

enum Grower {
    FERMENTOR = ev.next(), // 'GrowerType.FERMENTOR',
    INCUBATOR = ev.next(), // 'GrowerType.INCUBATOR'
}

export = Grower;
