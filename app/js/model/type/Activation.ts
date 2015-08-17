import ev = require('enumvalue');

enum Activation {
    WASHING                 = ev.next(),
    INCUBATOR               = ev.next(),
    COMPUTER_ORDER_DNA      = ev.next(),
    COMPUTER_ORDER_MOUSE    = ev.next(),
    COMPUTER_ORDER_SEQUENCE = ev.next(),
    COMPUTER_ORDER_DRUG     = ev.next(),
    BUNSEN                  = ev.next(),
    ELECTROPORATOR          = ev.next(),
    HEATER                  = ev.next(),
    ICE_BATH                = ev.next(),
    OD                      = ev.next(),
    BLENDER                 = ev.next(),
    FERMENTOR               = ev.next(),
    SPECTROPM               = ev.next(),
    SUPPLY                  = ev.next(),
    PCR                     = ev.next(),
    GELELECTRO              = ev.next(),
    BLUE_STAIN              = ev.next(),
    GEL                     = ev.next(),
};

export = Activation;
