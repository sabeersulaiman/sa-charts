import { Chart } from './chart.interface';
import { LineChartConfig } from '../models/line-data.model';
import {
    select,
    scaleLinear,
    line,
    schemeCategory10,
    scaleOrdinal,
    area,
    sum,
    scaleTime,
    ScaleTime,
    ScaleLinear,
    selectAll,
} from 'd3';
import {
    SaChartDimensions,
    SaChartData,
    SaSeries,
} from '../models/chart-data.model';
import { getCurveFromString } from '../helpers/curve.helpers';
import {
    defineColorFadingGradient,
    getIdFromColor,
} from '../helpers/gradient.helpers';
import { computeChartMetrics } from '../helpers/chart.helper';
import { ChartMetrics } from '../models/common.model';

export class LineChart implements Chart<SaChartData, LineChartConfig> {
    private _dems: SaChartDimensions = {
        margins: {
            top: 10,
            bottom: 10,
        },
    };

    private _chartInstance: HTMLElement;

    private _chartMetrics: ChartMetrics;

    private _data: SaChartData;

    private _eventAttached = false;

    private _xScale: ScaleTime<number, number>;

    private _yScale: ScaleLinear<number, number>;

    private _container: HTMLElement;

    private _chartConfig: LineChartConfig;

    constructor() {}

    public render(
        data: SaChartData,
        container: HTMLElement,
        config: LineChartConfig
    ) {
        const colorScale = scaleOrdinal(schemeCategory10);
        const svgContainer = select(container);

        this._chartConfig = config;

        // figure out the chart dimensions to go with
        const chartMetrics = computeChartMetrics(
            container,
            config.dimensions,
            data,
            config.heightFactor
        );

        this._container = container;

        this._chartMetrics = chartMetrics;
        this._data = data;

        // create the svg
        let svg = svgContainer.select('svg').datum(data);

        if (!svg.node()) {
            svg = svgContainer.insert('svg').datum(data);
        }

        svg = svg
            .attr('width', chartMetrics.svgWidth)
            .attr('height', chartMetrics.svgHeight);

        this._chartInstance = svg.node() as HTMLElement;

        if (config.tooltipEnabled) {
            this._attachTooltipListeners();
        }

        // set the height for height correction
        svgContainer.style('height', chartMetrics.svgHeight + 'px');

        if (config.showArea) {
            // add defs for gradients
            svg.select('defs').remove();
            const defs = svg.append('defs');

            for (const i in data.series) {
                if (data.series[i]) {
                    const series = data.series[i];

                    defineColorFadingGradient(
                        (series.color as string) || colorScale(i.toString()),
                        defs
                    );
                }
            }
        }

        const xScale = scaleTime()
            .domain(chartMetrics.xDomain)
            .range(chartMetrics.xRange);

        this._xScale = xScale;

        const yScale = scaleLinear()
            .domain(chartMetrics.yDomain)
            .range(chartMetrics.yRange);

        this._yScale = yScale;

        const lineGenerator = line<(number | number[])[]>()
            .x((d) => {
                return xScale(d[0] as number);
            })
            .y((d) => {
                return yScale(Array.isArray(d[1]) ? sum(d[1]) : d[1]);
            })
            .curve(getCurveFromString(config.curve));

        svg.selectAll('path.sa-path')
            .data((d) => d.series)
            .enter()
            .insert('path')
            .classed('sa-path', true)
            .merge(svg.selectAll('path.sa-path'))
            .attr('d', (d) => {
                return lineGenerator(d.data as number[][]);
            })
            .attr('fill', 'none')
            .attr('stroke-width', config.strokeWidth)
            .attr(
                'stroke',
                (d, i) => (d.color as string) || colorScale(i.toString())
            )
            .exit()
            .remove();

        if (config.showArea) {
            const areaGenerator = area<number[]>()
                .x((d) => {
                    return xScale(d[0]);
                })
                .y1((d: number[]) =>
                    yScale(Array.isArray(d[1]) ? sum(d[1]) : d[1])
                )
                .y0(chartMetrics.xAxisInclusiveArea || chartMetrics.yRange[0])
                .curve(getCurveFromString(config.curve) as any);

            svg.selectAll('path.sa-area-path')
                .data((d) => d.series)
                .enter()
                .insert('path')
                .classed('sa-area-path', true)
                .merge(svg.selectAll('path.sa-area-path'))
                .attr('d', (d) => {
                    return areaGenerator(d.data as number[][]);
                })
                .attr(
                    'fill',
                    (d, i) =>
                        `url(${getIdFromColor(
                            (d.color as string) || colorScale(i.toString())
                        )})`
                )
                .attr('stroke', 'none')
                .exit()
                .remove();
        }

        // draw x axis
        if (chartMetrics.xAxisPoints) {
            const group = svg
                .selectAll('g.x-axis')
                .data(
                    chartMetrics.xAxisPoints ? [chartMetrics.xAxisPoints] : []
                )
                .enter()
                .append('g')
                .classed('x-axis', true)
                .exit()
                .remove()
                .merge(svg.selectAll('g.x-axis'));

            const labels = group
                .selectAll('text.x-axis-label')
                .data(chartMetrics.xAxisPoints);

            labels
                .enter()
                .append('text')
                .classed('x-axis-label', true)
                .merge(svg.selectAll('text.x-axis-label') as any)
                .text((d) => {
                    if (data.xAxis.uppercase) {
                        return d.text.toUpperCase();
                    } else {
                        return d.text;
                    }
                })
                .attr('text-anchor', 'middle')
                .attr('x', (d) => xScale(d.x))
                .attr('y', chartMetrics.xAxisLabelStart - 10)
                .style('font-size', '13px')
                // .attr('text-anchor', 'middle')
                .each((d, i, texts) => {
                    const text = texts[i];
                    if (data.xAxis.labelRotation) {
                        const xy = {
                            x: Number(text.getAttribute('x')),
                            y: Number(text.getAttribute('y')),
                        };

                        select(text).attr(
                            'transform',
                            `rotate(${data.xAxis.labelRotation}, ${xy.x}, ${xy.y})`
                        );
                    }
                });

            labels.exit().remove();
        }
    }

    private _handleMouseLeave() {
        select(this._chartInstance).selectAll('line.tooltip-line').remove();
        select(this._chartInstance).selectAll('circle.tooltip-circle').remove();
        select(this._container).selectAll('div.sa-tooltip').remove();
    }

    private _attachTooltipListeners() {
        if (
            this._chartInstance &&
            this._container &&
            this._chartMetrics &&
            !this._eventAttached
        ) {
            this._eventAttached = true;
            this._container.addEventListener(
                'mousemove',
                this._handleMouseOver.bind(this)
            );

            this._container.addEventListener(
                'mouseleave',
                this._handleMouseLeave.bind(this)
            );
        }
    }

    private _handleMouseOver(e: MouseEvent) {
        // find where the svg is now
        const svgBox = this._chartInstance.getBoundingClientRect();
        const inSvgPoint = { x: e.x - svgBox.left, y: e.y - svgBox.top };

        const chartPoint = {
            x: inSvgPoint.x - this._chartMetrics.dimensions.margins.left,
            y: inSvgPoint.y - this._chartMetrics.dimensions.margins.top,
        };

        const chartWidth =
            this._chartMetrics.xRange[1] - this._chartMetrics.xRange[0];

        // find the corresponding y axis item
        const percent = (chartPoint.x / chartWidth) * 100;

        for (const series of this._data.series) {
            this._handleSeriesLine(series, percent);
        }
    }

    private _handleSeriesLine(series: SaSeries, percent: number) {
        // this is time series - only supporting it for now
        const approxDataTime =
            this._chartMetrics.xDomain[0] +
            ((this._chartMetrics.xDomain[1] - this._chartMetrics.xDomain[0]) /
                100) *
                percent;

        let bestDiff = NaN;
        let i = 0;
        let bestData = series.data[i];

        while (bestData) {
            const nDiff = Math.abs((bestData[0] as number) - approxDataTime);
            if (isNaN(bestDiff)) {
                bestDiff = nDiff;
            } else {
                if (bestDiff > nDiff) {
                    bestDiff = nDiff;
                } else if (bestDiff <= nDiff) {
                    i = i - 1;
                    bestData = series.data[i - 1];
                    break;
                }
            }

            i++;
            bestData = series.data[i];
        }

        if (!bestData) {
            i = i - 1;
            bestData = series.data[i] ? series.data[i] : null;
            if (!bestData) {
                return;
            }
        }

        const tLinePos = {
            top: {
                x: this._xScale(bestData[0] as number),
                y: this._yScale(this._chartMetrics.yDomain[1]),
            },
            bottom: {
                x: this._xScale(bestData[0] as number),
                y:
                    this._chartMetrics.xAxisInclusiveArea ||
                    this._chartMetrics.yRange[0],
            },
        };

        const tIndicatorPos = {
            x: this._xScale(bestData[0] as number),
            y: this._yScale(
                Array.isArray(bestData[1]) ? sum(bestData[1]) : bestData[1]
            ),
        };

        // draw a line for the data item
        const tooltipLine = select(this._chartInstance)
            .selectAll('line.tooltip-line')
            .data([bestData])
            .enter()
            .append('line')
            .classed('tooltip-line', true)
            .exit()
            .remove()
            .merge(select(this._chartInstance).selectAll('line.tooltip-line'));

        tooltipLine
            .attr('x1', tLinePos.top.x)
            .attr('y1', tLinePos.top.y)
            .attr('x2', tLinePos.bottom.x)
            .attr('y2', tLinePos.bottom.y)
            .style('stroke', (series.color as string) || 'red')
            .style('stroke-width', 1);

        // draw a circle to show as data point indicator
        const tCircle = select(this._chartInstance)
            .selectAll('circle.tooltip-circle')
            .data([bestData])
            .enter()
            .append('circle')
            .classed('tooltip-circle', true)
            .exit()
            .remove()
            .merge(
                select(this._chartInstance).selectAll('circle.tooltip-circle')
            );

        tCircle
            .attr('cx', tIndicatorPos.x)
            .attr('cy', tIndicatorPos.y)
            .attr('r', '.5rem')
            .attr('fill', (series.color as string) || 'red');

        // figure whether to show on the right or left
        // simple logic if the item is beyond the center point we show on the left else on right
        let isLeft = false;
        if (percent > 50) {
            isLeft = true;
        }

        const containerBox = this._container.getBoundingClientRect();

        // show the data info cards
        const tt = select(this._container)
            .selectAll('div.sa-tooltip')
            .data([bestData])
            .join(
                (en) =>
                    en
                        .append('div')
                        .classed('sa-tooltip', true)
                        .style('position', 'absolute')
                        .style(
                            'background',
                            series.color ? (series.color as string) : 'red'
                        )
                        .style('transform', 'translateY(-50%)')
                        .style('border-radius', '5px'),
                (up) =>
                    up
                        .style(
                            isLeft ? 'right' : 'left',
                            isLeft
                                ? containerBox.width -
                                      tIndicatorPos.x +
                                      12 +
                                      'px'
                                : tIndicatorPos.x + 12 + 'px'
                        )
                        .style(isLeft ? 'left' : 'right', 'unset')
                        .style('top', Math.max(50, tIndicatorPos.y) + 'px'),
                (ex) => ex.remove()
            );

        tt.selectAll('p.value')
            .data((d) => [d[1]])
            .join(
                (enter) => enter.append('p').classed('value', true),
                (update) =>
                    update.html(
                        (d) =>
                            `<b>${Array.isArray(d) ? sum(d) : d}</b>${
                                this._chartConfig.tooltipText
                                    ? ' ' + this._chartConfig.tooltipText
                                    : ''
                            }`
                    ),
                (exit) => exit.remove()
            );

        tt.selectAll('p.head')
            .data((d) => [d[0]])
            .join(
                (enter) => enter.append('p').classed('head', true),
                (update) =>
                    update.text((d) =>
                        this._chartMetrics.xFormatter(new Date(d as number))
                    ),
                (exit) => exit.remove()
            );
    }
}
