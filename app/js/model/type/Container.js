define([], function () {
    return {
        // Simple
        PETRI_DISH:        'ContainerType.PETRI_DISH',
        MICROTITER:        'ContainerType.MICROTITER',
        TUBE:              'ContainerType.TUBE',
        FERMENTOR_TANK:    'ContainerType.FERMENTOR_TANK',
        BOTTLE:            'ContainerType.BOTTLE',
        SYRINGE:           'ContainerType.SYRINGE',
        PIPETTE_TIP:       'ContainerType.PIPETTE_TIP',

        // Composite
        PETRI_SPACE:       'ContainerType.PETRI_SPACE',
        MICRO_SPACE:       'ContainerType.MICRO_SPACE',
        TUBE_RACK:         'ContainerType.TUBE_RACK',
        UV:                'ContainerType.UV',

        // Simple machines
        ELECTROPORATOR:    'ContainerType.ELECTROPORATOR',
        BLENDER:           'ContainerType.BLENDER',

        // Composite machines
        HEATER:            'ContainerType.HEATER',
        OD_MACHINE:        'ContainerType.OD_MACHINE',
        SPECTROPM_MACHINE: 'ContainerType.SPECTROPM_MACHINE',
        PIPETTE:           'ContainerType.PIPETTE'
    };
});
