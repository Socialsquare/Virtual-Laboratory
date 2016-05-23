
import PlotDataPointType = require('model/type/PlotDataPointType');

type PlotItemType = {
    data: PlotDataPointType[],
    //label: string,
    yaxis: number,
    color: string,
    lines: any
}

export = PlotItemType;
