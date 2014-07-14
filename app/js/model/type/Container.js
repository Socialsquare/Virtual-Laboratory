define([], function () {
    return {
        // Simple
        PETRI_DISH:        'ContainerType.PETRI_DISH',
        MICROTITER:        'ContainerType.MICROTITER',
        TUBE:              'ContainerType.TUBE',
        BOTTLE:            'ContainerType.BOTTLE',
        SYRINGE:           'ContainerType.SYRINGE',
        PIPETTE_TIP:       'ContainerType.PIPETTE_TIP',

        // Composite
        PETRI_SPACE:       'ContainerType.PETRI_SPACE',
        MICRO_SPACE:       'ContainerType.MICRO_SPACE',
        TUBE_RACK:         'ContainerType.TUBE_RACK',
        UV_PETRI_SPACE:    'ContainerType.UV_PETRI_SPACE',
        UV_MICRO_SPACE:    'ContainerType.UV_MICRO_SPACE',
        UV_TUBE_RACK:      'ContainerType.UV_TUBE_RACK',

        // Simple machines
        ELECTROPORATOR_TANK:    'ContainerType.ELECTROPORATOR_TANK',
        BLENDER:           'ContainerType.BLENDER',
        FERMENTOR_TANK:    'ContainerType.FERMENTOR_TANK',
        WASHING_TANK:      'ContainerType.WASHING_TANK',
        //TODO: washing machine-tank

        // Composite machines
        HEATER:            'ContainerType.HEATER',
        OD_MACHINE:        'ContainerType.OD_MACHINE',
        SPECTROPM_MACHINE: 'ContainerType.SPECTROPM_MACHINE',
        PIPETTE:           'ContainerType.PIPETTE',
        ELECTROPORATOR:    'ContainerType.ELECTROPORATOR',
        FERMENTOR:         'ContainerType.FERMENTOR',
        WASHING:           'ContainerType.WASHING'
        //TODO: washing machine
    };
});
