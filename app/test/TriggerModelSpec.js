define([
    'lodash',

    'model/Trigger',

    'model/type/Trigger',
    'model/type/Activation',
    'model/type/Liquid',
    'model/type/Microorganism',
], function (_, TriggerModel, TriggerType, ActivationType, LiquidType, MicroorganismType) {

    describe('Trigger model from json', function() {
        it('should parse types correctly', function () {
            var values = {
                "type": "TriggerType.ACTIVATION",
                "activation": "ActivationType.ELECTROPORATOR",
                "liquids": [
                    { "type": "LiquidType.MICROORGANISM", "subtype": "MicroorganismType.YEAST" },
                    { "type": "LiquidType.GENE"}
                ]
            };

            var tm = new TriggerModel(values);

            expect(tm.type).toBe(TriggerType.ACTIVATION);
            expect(tm.activation).toBe(ActivationType.ELECTROPORATOR);
        });
    });
});
