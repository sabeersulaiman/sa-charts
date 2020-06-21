import { SaChartDimensions } from './chart-data.model';

export interface LineChartConfig {
    curve: string;
    showArea: boolean;
    strokeWidth: number;
    heightFactor: number;
    dimensions: SaChartDimensions;
    tooltipText?: string;
    tooltipEnabled?: boolean;
}
