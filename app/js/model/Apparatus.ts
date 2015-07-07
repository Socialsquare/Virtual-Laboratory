import S2T = require('utils/S2T');
import ApparatusType = require('model/type/Apparatus');
import ApparatusLocationType = require('model/type/ApparatusLocation');

class Apparatus {

    public config: { [ location: number ]: ApparatusType } = {};

    constructor() {
        // Defaults
        this.config[ApparatusLocationType.CORNER] = ApparatusType.CORNER_SPECTRO;
        this.config[ApparatusLocationType.UV_ROOM] = ApparatusType.UV_ROOM_MICROTITER;
    }

    apparatusEnabled(location: ApparatusLocationType, type: ApparatusType) {
        return this.config[location] === type;
    }

    static parse(values: any) {

        var ap = new Apparatus();

        for (var rawLocation in values) {
            var type = S2T.apparatus(values[rawLocation]);
            var location = S2T.apparatusLocation(rawLocation);

            ap.config[location] = type;
        }

        return ap;
    }
}

export = Apparatus;
