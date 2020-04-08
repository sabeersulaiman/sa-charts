export interface SaChartDimensions {
    margins?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    width?: number;
    height?: number;
}

export interface SaChartData {
    title?: string;
    series: SaSeries[];
    xAxis: SaAxis;
}

export interface SaSeries {
    name?: string;
    data: (number | number[])[][];
    color?: string | (string | string[])[];
}

export interface SaAxis {
    title?: string;
    labels?: string[] | Date[];
    timeData: boolean;
    ticks?: number;
    disabled?: boolean;
    extendAreaToAxis?: boolean;
    labelRotation?: number;
}

export const curveTypes = {
    linear: 'Linear',
    natural: 'Natural',
    bundleBeta1: 'BundleBeta1',
};
