import DrugService = require('service/Drug');

describe('Drug service', () => {
    it('should get correct scaffold from name', () => {
        var scaffold = DrugService.getScaffold("1");

        // Check some random values
        expect(scaffold.name).toBe("1");
        expect(scaffold.slots().length).toBe(3);
        expect(scaffold.id).toBe("1");
        expect(scaffold.offset.x).toBe(372);
    });
});
