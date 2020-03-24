export interface SaLineChartData {
    title?: string;
    series: SaSeries[];
    xAxis: SaAxis;
}

export interface SaSeries {
    name?: string;
    data: number[];
    color?: string;
}

export interface SaAxis {
    title?: string;
    labels: string[] | Date[];
}

export interface LineChartConfig {
    curve: string;
    showArea: boolean;
    strokeWidth: number;
}

export const curveTypes = {
    linear: 'Linear',
    natural: 'Natural',
    bundleBeta1: 'BundleBeta1'
};
