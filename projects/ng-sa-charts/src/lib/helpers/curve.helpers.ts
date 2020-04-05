import {
    curveLinear,
    curveNatural,
    curveBundle,
    CurveFactory,
    CurveBundleFactory
} from 'd3';
import { curveTypes } from '../models/chart-data.model';

/**
 * get the curve from curve string
 * @param type type string
 */
export function getCurveFromString(
    type: string
): CurveFactory | CurveBundleFactory {
    switch (type) {
        case curveTypes.linear:
            return curveLinear;
        case curveTypes.natural:
            return curveNatural;
        case curveTypes.bundleBeta1:
            return curveBundle.beta(1);
        default:
            return curveBundle.beta(1);
    }
}
