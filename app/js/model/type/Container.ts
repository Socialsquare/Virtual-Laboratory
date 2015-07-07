import ev = require('enumvalue');

enum Container {
    // Simple
    PETRI_DISH        = ev.next(),
    MICROTITER        = ev.next(),
    TUBE              = ev.next(),
    BOTTLE            = ev.next(),
    SYRINGE           = ev.next(),
    PIPETTE_TIP       = ev.next(),
    LANE              = ev.next(),

    // Composite
    PETRI_SPACE       = ev.next(),
    MICRO_SPACE       = ev.next(),
    TUBE_RACK         = ev.next(),
    UV_PETRI_SPACE    = ev.next(),
    UV_MICRO_SPACE    = ev.next(),
    UV_TUBE_RACK      = ev.next(),
    ICE_BATH          = ev.next(),

    // Simple machines
    BLENDER           = ev.next(),
    ELECTROPORATOR    = ev.next(),
    FERMENTOR_TANK    = ev.next(),
    WASHING_TANK      = ev.next(),

    // Composite machines
    HEATER            = ev.next(),
    OD_MACHINE        = ev.next(),
    SPECTROPM_MACHINE = ev.next(),
    PIPETTE           = ev.next(),
    FERMENTOR         = ev.next(),
    CENTRIFUGE        = ev.next(),
    PCR_MACHINE       = ev.next(),
}

export = Container;
