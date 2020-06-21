import { SaChartDimensions, SaChartData } from '../models/chart-data.model';
import { ChartMetrics } from '../models/common.model';
import {
    ascending,
    sum,
    timeHour,
    timeDay,
    timeYear,
    timeMonth,
    timeFormat,
    timeMinute,
    timeWeek,
} from 'd3';

function fixDemensions(node: HTMLElement, dems: SaChartDimensions, heightFactor: number) {
    const possibleWidth = node ? node.getBoundingClientRect().width : 300;
    const computedDems: SaChartDimensions = {
        width: possibleWidth,
        height: possibleWidth * heightFactor,
        margins: {
            top: 50,
            left: 50,
            bottom: 50,
            right: 50,
        },
    };

    if (dems) {
        if (dems.width) {
            computedDems.width = dems.width;
        }

        if (dems.height) {
            computedDems.height = dems.height;
        } else {
            computedDems.height = computedDems.width * heightFactor;
        }

        if (dems.margins) {
            computedDems.margins.top =
                dems.margins.top === undefined
                    ? computedDems.margins.top
                    : dems.margins.top;
            computedDems.margins.right =
                dems.margins.right === undefined
                    ? computedDems.margins.right
                    : dems.margins.right;
            computedDems.margins.bottom =
                dems.margins.bottom === undefined
                    ? computedDems.margins.bottom
                    : dems.margins.bottom;
            computedDems.margins.left =
                dems.margins.left === undefined
                    ? computedDems.margins.left
                    : dems.margins.left;
        }
    }

    return computedDems;
}

export function computeChartMetrics(
    node: HTMLElement,
    dems: SaChartDimensions,
    data: SaChartData,
    heightFactor: number,
    xAxisScaled: boolean = true
): ChartMetrics {
    const metrics: ChartMetrics = {};
    const xAxisHeight = 65;

    dems = fixDemensions(node, dems, heightFactor);
    metrics.dimensions = dems;

    // calculate the svg width & height
    metrics.svgWidth = dems.width;
    metrics.svgHeight = dems.height;

    // chart height & width - take axes into account
    metrics.chartHeight =
        metrics.svgHeight - dems.margins.top - dems.margins.bottom;
    if (!data.xAxis.disabled) {
        metrics.chartHeight -= xAxisHeight;
        metrics.xAxisLabelStart =
            metrics.chartHeight + dems.margins.top + (xAxisHeight - 16);
    }

    metrics.chartWidth =
        metrics.svgWidth - dems.margins.left - dems.margins.right;

    metrics.yDataMax = NaN;
    metrics.yDataMin = NaN;

    metrics.xDataMax = NaN;
    metrics.xDataMin = NaN;

    for (const d of data.series) {
        // first value in data is x-axis value if data is time series
        if (d.data && d.data.length > 0 && Array.isArray(d.data[0])) {
            d.data.sort((a, b) => ascending(a[0] as number, b[0] as number));
            if (!(metrics.xDataMax > d.data[d.data.length - 1][0])) {
                metrics.xDataMax = d.data[d.data.length - 1][0] as number;
            }

            if (!(metrics.xDataMin < d.data[0][0])) {
                metrics.xDataMin = d.data[0][0] as number;
            }
        }

        for (const dataPoint of d.data) {
            if (Array.isArray(dataPoint)) {
                const arr = dataPoint as (number | number[])[];

                const pointYSum: number[] = [];
                for (let i = 1; i < arr.length; i++) {
                    if (Array.isArray(arr[i])) {
                        // we have multiple blocks of data
                        pointYSum.push(sum(arr[i] as number[]));
                    } else {
                        pointYSum.push(arr[i] as number);
                    }
                }

                if (!(metrics.yDataMin < Math.min(...pointYSum))) {
                    metrics.yDataMin = Math.min(...pointYSum);
                }

                if (!(metrics.yDataMax > Math.max(...pointYSum))) {
                    metrics.yDataMax = Math.max(...pointYSum);
                }
            }
        }
    }

    metrics.yDataMax += metrics.yDataMax * 0.2;

    if (metrics.yDataMin < 0) {
        metrics.yDataMin -= metrics.yDataMin * 0.2;
    } else {
        metrics.yDataMin = 0;
    }

    // domain and range
    metrics.xDomain = [metrics.xDataMin, metrics.xDataMax];
    metrics.xRange = [
        dems.margins.left,
        metrics.chartWidth + dems.margins.left,
    ];

    metrics.yDomain = [metrics.yDataMin, metrics.yDataMax];
    metrics.yRange = [metrics.chartHeight + dems.margins.top, dems.margins.top];

    // generate the axes
    if (!data.xAxis.disabled && data.xAxis.timeData && xAxisScaled) {
        if (data.xAxis.extendAreaToAxis) {
            metrics.xAxisInclusiveArea = metrics.yRange[0] + xAxisHeight;
        }
        generateAxes(metrics);

        if (!dems.margins.left) {
            metrics.xAxisPoints = metrics.xAxisPoints.filter(
                (_x, i) => i !== 0
            );
        }

        if (!dems.margins.right) {
            metrics.xAxisPoints = metrics.xAxisPoints.filter(
                (_x, i) => i !== metrics.xAxisPoints.length - 1
            );
        }
    } else if (!data.xAxis.disabled && data.xAxis.timeData && !xAxisScaled) {
        // from data choose the amount we can show
        const timeDiff = metrics.xDataMax - metrics.xDataMin;
        const labelSize = 62.5;
        const visibleLabels = Math.floor(metrics.chartWidth / labelSize);
        const step = Math.floor(data.series[0].data.length / visibleLabels);

        const labelledData = data.series[0].data
            .map((x, i) => {
                if (i % step === 0 || step === 0) {
                    return { date: new Date(x[0] as number), index: i };
                } else {
                    return null;
                }
            })
            .filter((x) => x);

        // find the format based on period
        let format: (d: Date) => string;
        const periodInDays = timeDiff / 8.64e7;

        if (periodInDays < 2) {
            // format 09:00 AM {size: 55 x 16}
            format = timeFormat('%I:%M %p');
        } else if (periodInDays < 65) {
            // format Jan 21 { size: 35 x 16 }
            format = timeFormat('%b %d');
        } else {
            // format Jan 2017 { size: 50 x 16 }
            format = timeFormat('%b %Y');
        }

        metrics.xAxisPoints = [];
        for (const d of labelledData) {
            metrics.xAxisPoints.push({
                text: format(d.date),
                x: d.index,
            });
        }

        metrics.xFormatter = format;
    }

    return metrics;
}

function generateAxes(metrics: ChartMetrics) {
    // find the difference in time
    const timeDiff = metrics.xDataMax - metrics.xDataMin;

    // range info
    let range: Date[] = [];
    const start = new Date(metrics.xDataMin);
    const end = new Date(metrics.xDataMax);
    const labelSize = 62.5;

    // find the format based on period
    let format: (d: Date) => string;
    const periodInDays = timeDiff / 8.64e7;

    if (periodInDays < 2) {
        // format 09:00 AM {size: 55 x 16}
        format = timeFormat('%I:%M %p');
        if (start.getMinutes() !== 0) {
            range.push(start);
        }
        range.push(...timeHour.range(start, end, 1));
        range.push(end);
    } else if (periodInDays < 65) {
        // format Jan 21 { size: 35 x 16 }
        format = timeFormat('%b %d');
        if (start.getHours() !== 0) {
            range.push(start);
        }
        range = timeDay.range(start, end, 1);
        range.push(end);
    } else {
        // format Jan 2017 { size: 50 x 16 }
        format = timeFormat('%b %Y');
        if (start.getDate() !== 1) {
            range.push(start);
        }
        range = timeMonth.range(start, end, 1);
        range.push(end);
    }

    const possibleLabels = Math.floor(
        (metrics.chartWidth - labelSize) / labelSize
    );
    const skipCount = Math.floor(range.length / possibleLabels);

    if (skipCount !== 0) {
        range = range.filter((_x, i) => {
            if (i === 0 || i === range.length - 1 || i % skipCount === 0) {
                return true;
            }
        });
    }

    metrics.xAxisPoints = [];
    for (const date of range) {
        metrics.xAxisPoints.push({
            text: format(date),
            x: date.getTime(),
        });
    }

    metrics.xFormatter = format;
}
