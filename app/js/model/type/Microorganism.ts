import ev = require('enumvalue');

enum Microorganism {
    YEAST   = ev.next(), // 'MicroorganismType.YEAST',
    MYELOMA = ev.next(), // 'MicroorganismType.MYELOMA'
};

export = Microorganism;
