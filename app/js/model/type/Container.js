define([], function () {
    return {
        // Simple
        PETRI_DISH:        'ContainType.PETRI_DISH',
        MICROTITER:        'ContainType.MICROTITER',
        TUBE:              'ContainType.TUBE',
        FERMENTOR_TANK:    'ContainType.FERMENTOR_TANK',
        BOTTLE:            'ContainType.BOTTLE',
        SYRINGE:           'ContainType.SYRINGE',

        // Composite
        PETRI_SPACE:       'ContainType.PETRI_SPACE',
        MICRO_SPACE:       'ContainType.MICRO_SPACE',
        TUBE_RACK:         'ContainType.TUBE_RACK',
        UV:                'ContainType.UV',

        // Simple machines
        ELECTROPORATOR:    'ContainType.ELECTROPORATOR',
        BLENDER:           'ContainType.BLENDER',

        // Composite machines
        HEATER:            'ContainType.HEATER',
        OD_MACHINE:        'ContainType.OD_MACHINE',
        SPECTROPM_MACHINE: 'ContainType.SPECTROPM_MACHINE'
    };
});
