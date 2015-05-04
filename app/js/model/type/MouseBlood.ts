import ev = require('enumvalue');

enum MouseBlood {
    NORMAL   = ev.next(), // 'MouseBloodType.NORMAL',
    DIABETIC = ev.next(), // 'MouseBloodType.DIABETIC'
}

export = MouseBlood;
