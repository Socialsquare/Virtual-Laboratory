import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');

describe('Myeloma', () => {

    it('and homo spleen with antibodies added to a microtiter should result in antibody in all wells', () => {

        const microtiter = ContainerFactory.micro();

        microtiter.add(LiquidFactory.hybridomaMedium());
        microtiter.add(LiquidFactory.microorganism.myeloma());
        microtiter.add(LiquidFactory.homoSpleen(LiquidFactory.antibodySmallpox()));

        const hasAllWellAntibodies = microtiter.microtiterWells().wells().every(w => w.hasAntibody());

        expect(hasAllWellAntibodies).toBe(true);
    });
});
