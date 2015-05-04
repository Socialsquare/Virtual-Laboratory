import ev = require('enumvalue');

enum Container {
    // Simple
    PETRI_DISH        = ev.next(), //        'ContainerType.PETRI_DISH',
    MICROTITER        = ev.next(), //        'ContainerType.MICROTITER',
    TUBE              = ev.next(), //              'ContainerType.TUBE',
    BOTTLE            = ev.next(), //            'ContainerType.BOTTLE',
    SYRINGE           = ev.next(), //           'ContainerType.SYRINGE',
    PIPETTE_TIP       = ev.next(), //       'ContainerType.PIPETTE_TIP',

    // Composite
    PETRI_SPACE       = ev.next(), //       'ContainerType.PETRI_SPACE',
    MICRO_SPACE       = ev.next(), //       'ContainerType.MICRO_SPACE',
    TUBE_RACK         = ev.next(), //         'ContainerType.TUBE_RACK',
    UV_PETRI_SPACE    = ev.next(), //    'ContainerType.UV_PETRI_SPACE',
    UV_MICRO_SPACE    = ev.next(), //    'ContainerType.UV_MICRO_SPACE',
    UV_TUBE_RACK      = ev.next(), //      'ContainerType.UV_TUBE_RACK',

    // Simple machines
    BLENDER           = ev.next(), //           'ContainerType.BLENDER',
    ELECTROPORATOR    = ev.next(), //    'ContainerType.ELECTROPORATOR',
    FERMENTOR_TANK    = ev.next(), //    'ContainerType.FERMENTOR_TANK',
    WASHING_TANK      = ev.next(), //      'ContainerType.WASHING_TANK',

    // Composite machines
    HEATER            = ev.next(), //            'ContainerType.HEATER',
    OD_MACHINE        = ev.next(), //        'ContainerType.OD_MACHINE',
    SPECTROPM_MACHINE = ev.next(), // 'ContainerType.SPECTROPM_MACHINE',
    PIPETTE           = ev.next(), //           'ContainerType.PIPETTE',
    FERMENTOR         = ev.next(), //         'ContainerType.FERMENTOR',
}

export = Container;
