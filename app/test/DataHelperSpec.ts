import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');
import DataHelper = require('utils/DataHelper');


describe('toCSV', () => {
    it('should just return what I want', () => {
        var someDate = new Date();
        var dataIn = [[1, '2', null, undefined, '', 12.123456789, someDate, 'test']];
        var headersIn = dataIn[0];
        var expectedDateStr = someDate.toLocaleTimeString('da');
        var actualVal = DataHelper.toCSV(dataIn, headersIn);
        var expectedHeader = headersIn.join('; ');
        var expectedData = '1.00; 2; unknown; unknown; unknown; 12.12; '+expectedDateStr+'; test';

        var expectedVal =  expectedHeader + '\n' + expectedData;
        expect(expectedVal).toEqual(actualVal);
    });
});
