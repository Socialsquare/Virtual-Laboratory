import PlotItemType = require('model/type/PlotItemType');


interface VetMonitor {
    
    public hasExportButton: KnockoutObservable<boolean>;
    public hasHartRateButton: KnockoutObservable<boolean>;
    public hasBloodSugarButton: KnockoutObservable<boolean>;
    public hasGlucoseInfusionRateButton: KnockoutObservable<boolean>;
    public plotData: KnockoutComputed<PlotItemType[]>;

};

export = VetMonitor;