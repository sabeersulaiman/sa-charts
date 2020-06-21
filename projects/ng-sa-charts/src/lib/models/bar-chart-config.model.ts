import { SaChartDimensions } from './chart-data.model';

export interface BarChartConfig {
    dimensions: SaChartDimensions;
    heightFactor: number;
    legend: { color: string; name: string }[];
    tooltipEnabled: boolean;
}
