define([
    'factory/Container'
], function (ContainerFactory) {
    describe("A suite 2", function() {
        it("contains spec with an expectation", function() {
            var t = ContainerFactory.tube();
            expect(t.liquids().length).toBe(0);
        });

        it("contains spec with an expectation", function() {
            expect(true).toBe(true);
        });
    });
});
