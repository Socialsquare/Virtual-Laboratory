import ev = require('enumvalue');

enum Activation {
    WASHING                 = ev.next(), // "ActivationType.WASHING",
    INCUBATOR               = ev.next(), // "ActivationType.INCUBATOR",
    COMPUTER_ORDER_DNA      = ev.next(), // "ActivationType.COMPUTER_ORDER_DNA",
    COMPUTER_ORDER_MOUSE    = ev.next(), // "ActivationType.COMPUTER_ORDER_MOUSE",
    COMPUTER_ORDER_SEQUENCE = ev.next(), // "ActivationType.COMPUTER_ORDER_SEQUENCE",
    COMPUTER_ORDER_DRUG     = ev.next(), // "ActivationType.COMPUTER_ORDER_DRUG",
    BUNSEN                  = ev.next(), // "ActivationType.BUNSEN",
    ELECTROPORATOR          = ev.next(), // "ActivationType.ELECTROPORATOR",
    HEATER                  = ev.next(), // "ActivationType.HEATER",
    OD                      = ev.next(), // "ActivationType.OD",
    BLENDER                 = ev.next(), // "ActivationType.BLENDER",
    FERMENTOR               = ev.next(), // "ActivationType.FERMENTOR",
    SPECTROPM               = ev.next(), // "ActivationType.SPECTROPM"
};

export = Activation;
