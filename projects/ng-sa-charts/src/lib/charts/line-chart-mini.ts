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
    selectAll,
    scaleTime
} from 'd3';
import { SaChartDimensions, SaChartData } from '../models/chart-data.model';
import { getCurveFromString } from '../helpers/curve.helpers';
import {
    defineColorFadingGradient,
    getIdFromColor
} from '../helpers/gradient.helpers';
import { computeChartMetrics } from '../helpers/chart.helper';

export class LineChartMini implements Chart<SaChartData, LineChartConfig> {
    private _dems: SaChartDimensions = {
        margins: {
            top: 10,
            bottom: 10
        }
    };

    constructor() {}

    public render(
        data: SaChartData,
        container: HTMLElement,
        config: LineChartConfig
    ) {
        const colorScale = scaleOrdinal(schemeCategory10);
        const svgContainer = select(container);

        // figure out the chart dimensions to go with
        const chartMetrics = computeChartMetrics(
            container,
            config.dimensions,
            data
        );

        // create the svg
        let svg = svgContainer.select('svg').datum(data);

        if (!svg.node()) {
            svg = svgContainer.insert('svg').datum(data);
        }

        svg = svg
            .attr('width', chartMetrics.svgWidth)
            .attr('height', chartMetrics.svgHeight);

        if (config.showArea) {
            // add defs for gradients
            svg.select('defs').remove();
            const defs = svg.append('defs');

            for (const i in data.series) {
                if (data.series[i]) {
                    const series = data.series[i];

                    defineColorFadingGradient(
                        series.color || colorScale(i.toString()),
                        defs
                    );
                }
            }
        }

        const xScale = scaleTime()
            .domain(chartMetrics.xDomain)
            .range(chartMetrics.xRange);

        const yScale = scaleLinear()
            .domain(chartMetrics.yDomain)
            .range(chartMetrics.yRange);

        const lineGenerator = line<(number | number[])[]>()
            .x(d => {
                return xScale(d[0] as number);
            })
            .y(d => {
                return yScale(Array.isArray(d[1]) ? sum(d[1]) : d[1]);
            })
            .curve(getCurveFromString(config.curve));

        svg.selectAll('path.sa-path')
            .data(d => d.series)
            .enter()
            .insert('path')
            .classed('sa-path', true)
            .merge(svg.selectAll('path.sa-path'))
            .attr('d', d => {
                return lineGenerator(d.data as number[][]);
            })
            .attr('fill', 'none')
            .attr('stroke-width', config.strokeWidth)
            .attr('stroke', (d, i) => d.color || colorScale(i.toString()))
            .exit()
            .remove();

        if (config.showArea) {
            const areaGenerator = area<number[]>()
                .x(d => {
                    return xScale(d[0]);
                })
                .y1((d: number[]) =>
                    yScale(Array.isArray(d[1]) ? sum(d[1]) : d[1])
                )
                .y0(chartMetrics.xAxisInclusiveArea || chartMetrics.yRange[0])
                .curve(getCurveFromString(config.curve) as any);

            svg.selectAll('path.sa-area-path')
                .data(d => d.series)
                .enter()
                .insert('path')
                .classed('sa-area-path', true)
                .merge(svg.selectAll('path.sa-area-path'))
                .attr('d', d => {
                    return areaGenerator(d.data as number[][]);
                })
                .attr(
                    'fill',
                    (d, i) =>
                        `url(${getIdFromColor(
                            d.color || colorScale(i.toString())
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
                .merge(selectAll('g.x-axis'));

            const labels = group
                .selectAll('text.x-axis-label')
                .data(chartMetrics.xAxisPoints);

            labels
                .enter()
                .append('text')
                .classed('x-axis-label', true)
                .merge(selectAll('text.x-axis-label') as any)
                .text(d => d.text)
                .attr('text-anchor', 'middle')
                .attr('x', d => xScale(d.x))
                .attr('y', chartMetrics.xAxisLabelStart)
                .style('font-size', '13px')
                // .attr('text-anchor', 'middle')
                .each(function(d, i) {
                    if (data.xAxis.labelRotation) {
                        const xy = {
                            x: Number(this.getAttribute('x')),
                            y: Number(this.getAttribute('y'))
                        };

                        select(this).attr(
                            'transform',
                            `rotate(${data.xAxis.labelRotation}, ${xy.x}, ${xy.y})`
                        );
                    }
                });

            labels.exit().remove();
        }
    }
}
