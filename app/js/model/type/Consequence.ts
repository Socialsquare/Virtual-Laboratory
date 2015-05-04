import ev = require('enumvalue');

enum Consequence {
    QUIZ       = ev.next(), // "ConsequenceType.QUIZ",
    VIDEO      = ev.next(), // "ConsequenceType.VIDEO",
    QUIZ_VIDEO = ev.next(), // "ConsequenceType.QUIZ_VIDEO"
};

export = Consequence;
