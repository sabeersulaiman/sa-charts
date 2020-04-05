export interface ChartMetrics {
    svgWidth?: number;
    svgHeight?: number;
    chartHeight?: number;
    chartWidth?: number;
    yDataMax?: number;
    yDataMin?: number;
    xDataMax?: number;
    xDataMin?: number;
    xDomain?: number[];
    xRange?: number[];
    yDomain?: number[];
    yRange?: number[];
    xAxisPoints?: { text: string; x: number }[];
    xAxisLabelStart?: number;
    xAxisInclusiveArea?: number;
}
