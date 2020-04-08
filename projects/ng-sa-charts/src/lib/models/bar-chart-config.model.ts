import { SaChartDimensions } from './chart-data.model';

export interface BarChartConfig {
    dimensions: SaChartDimensions;
    legend: { color: string; name: string }[];
}
