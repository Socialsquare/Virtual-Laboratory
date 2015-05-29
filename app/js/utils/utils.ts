import ko = require('knockout');
import _ = require('lodash');
import mapping = require('knockout.mapping');

import LiquidType = require('model/type/Liquid');

import LiquidModel = require('model/Liquid');
import MicroorganismModel = require('model/Microorganism');

import lh = require('utils/LiquidHelper');


class Utils {
    // Clone a knockout object by making it a plain object and
    // mapping it back to observables
    static klone = (obj: any) => {
        return mapping.fromJS(ko.toJS(obj));
    };

    static biology = {
        dilute: (factor: number, liquids: LiquidModel[]) => {
            var clones: LiquidModel[] = _.invoke(liquids, 'clone');

            _.each(lh.mos(clones), (mo) => {
                mo.concentration(mo.concentration() / factor);
            });

            // Remove organisms whose concentration is below 1.
            clones = _.filter(clones, (liquid) => {
                if (liquid.type() !== LiquidType.MICROORGANISM)
                    return true;

                return (<MicroorganismModel>liquid).concentration() >= 1;
            });

            return clones;
        }
    };

    static math = {
        getBaseLog: (base, num) => {
            return Math.log(num) / Math.log(base);
        },

        // Converts from concentration to biomass (g/L)
        getBiomassFromConcentration: (concentration) => {
            return concentration / Math.pow(10, 12);
        },

        getConcentrationFromBiomass: (biomass) => {
            return biomass * Math.pow(10, 12);
        }
    };

    static formatter = {
        leadingZeros: (num, size) => {
            var s = num + '';
            while (s.length < size) s = '0' + s;
            return s;
        }
    };
}

export = Utils;
