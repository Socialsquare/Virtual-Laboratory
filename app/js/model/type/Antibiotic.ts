import ev = require('enumvalue');

enum Antibiotic {
    A = ev.next(), // 'AntibioticType.A',
    B = ev.next(), // 'AntibioticType.B'
};

export = Antibiotic;
