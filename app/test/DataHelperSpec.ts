import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');
import DataHelper = require('utils/DataHelper');


describe('toCSV', () => {
    it('should just return what I want', () => {
        var someDate = new Date();
        var dataIn = [[1, '2', null, undefined, '', 12.123456789, someDate, 'test']];
        var headersIn = dataIn[0];
        var dOptions = {year: '2-digit', month: '2-digit', day:'2-digit'};
        var dateStr = someDate.toLocaleDateString('dk', dOptions);
        var timeStr = someDate.toLocaleTimeString('dk');
        var expectedDateStr = dateStr + '@' + timeStr;
        var actualVal = DataHelper.toCSV(dataIn, headersIn);
        //var expectedHeader = '1\t2\t\t\t12.123456789\ttest';
        var expectedHeader = headersIn.join('\t');
        var expectedData = '1.00\t2\t\t\t\t12.12\t'+expectedDateStr+'\ttest';
        var expectedVal =  expectedHeader + '\n' + expectedData;
        expect(expectedVal).toEqual(actualVal);
    });
});
