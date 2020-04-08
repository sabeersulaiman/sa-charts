import { Chart } from './chart.interface';
import { BarChartConfig } from '../models/bar-chart-config.model';
import { SaChartData } from '../models/chart-data.model';
import {
    select,
    scaleOrdinal,
    schemeCategory10,
    Selection,
    scaleLinear,
    ScaleLinear,
} from 'd3';
import { computeChartMetrics } from '../helpers/chart.helper';

export class BarChart implements Chart<SaChartData, BarChartConfig> {
    public render(
        data: SaChartData,
        container: HTMLElement,
        config: BarChartConfig
    ) {
        const colorScale = scaleOrdinal(schemeCategory10);
        const svgContainer = select(container);

        // figure out the chart dimensions to go with
        const chartMetrics = computeChartMetrics(
            container,
            config.dimensions,
            data,
            false
        );

        // create the svg
        let svg = svgContainer.select('svg').datum(data);

        if (!svg.node()) {
            svg = svgContainer.insert('svg').datum(data);
        }

        svg.attr('width', chartMetrics.svgWidth)
            .attr('height', chartMetrics.svgHeight)
            .attr('xmlns', 'http://www.w3.org/2000/svg');

        // set the height for height correction
        svgContainer.style('height', chartMetrics.svgHeight + 'px');

        // draw the legend - if one exists
        let legendHeight = 0;
        if (config.legend && config.legend.length > 0) {
            const legend = config.legend;

            const fo = svg.select('foreignObject.legends').node()
                ? svg.select<SVGForeignObjectElement>('foreignObject.legends')
                : svg
                      .append('foreignObject')
                      .classed('legends', true)
                      .attr('x', 0)
                      .attr('y', 0)
                      .attr('width', chartMetrics.svgWidth)
                      .attr('height', chartMetrics.svgHeight);

            const lb = fo.select<HTMLDivElement>('.legend-box').node()
                ? fo.select<HTMLDivElement>('.legend-box')
                : fo
                      .append<HTMLDivElement>('xhtml:div')
                      .classed('legend-box', true)
                      .style('position', 'absolute')
                      .style('left', 0)
                      .style('right', 0)
                      .style('top', 0)
                      .style('display', 'flex')
                      .style('align-items', 'center')
                      .style('justify-content', 'center')
                      .style('flex-wrap', 'wrap');

            const items = lb
                .selectAll('div.legend-item')
                .data(legend)
                .join(
                    (enter) => {
                        enter = enter
                            .append<HTMLDivElement>('div')
                            .classed('legend-item', true)
                            .style('display', 'flex')
                            .style('align-items', 'center')
                            .style('margin-right', '20px');

                        enter
                            .append('div')
                            .classed('legend-color', true)
                            .style('background-color', (d) => d.color)
                            .style('width', '20px')
                            .style('height', '8px')
                            .style('border-radius', '20px');

                        enter
                            .append('p')
                            .classed('legend-name', true)
                            .style('margin', '4px 0')
                            .style('margin-left', '12px')
                            .style('font-weight', 600)
                            .style('font-size', '13px')
                            .html((d) => d.name);

                        return enter;
                    },
                    (update) => {
                        update
                            .select('div.legend-color')
                            .style('background-color', (d) => d.color);

                        update.select('.legend-name').html((d) => d.name);

                        return update;
                    },
                    (exit) => exit.remove()
                );

            legendHeight = lb.node().getBoundingClientRect().height;
        } else {
            svg.select('foreignObject.legends').remove();
        }

        const barDimensions: BarDimensions = {
            itemCount: data.series[0].data.length,
            barCount: data.series[0].data[0].length - 1,
            singleSize: 0,
            barWidth: 0,
            gap: 0,
            itemGap: 0,
            yScale: null,
        };

        barDimensions.singleSize =
            chartMetrics.chartWidth / barDimensions.itemCount;
        barDimensions.barWidth = Math.max(3, barDimensions.singleSize * 0.14); // 14% of the singleSize
        barDimensions.gap = barDimensions.barWidth * 0.7;
        barDimensions.itemGap =
            (barDimensions.singleSize -
                barDimensions.barWidth * barDimensions.barCount -
                barDimensions.gap * (barDimensions.barCount - 1)) /
            2;

        // draw the bars
        chartMetrics.yRange[1] = chartMetrics.yRange[1] + legendHeight;
        chartMetrics.chartHeight = chartMetrics.chartHeight - legendHeight;

        barDimensions.yScale = scaleLinear()
            .domain(chartMetrics.yDomain)
            .range(chartMetrics.yRange);

        const barContainer = svg.select('g.bar-container').node()
            ? svg.select<SVGGElement>('g.bar-container')
            : svg
                  .append('g')
                  .attr('class', 'bar-container')
                  .attr('pointer-events', 'all');

        // add some rects for highlighting the groups
        barContainer
            .selectAll('g.highlight-rects')
            .data([data])
            .join(
                (enter) => enter.append('g').attr('class', 'highlight-rects'),
                (update) => update,
                (exit) => exit.remove()
            )
            .selectAll('rect.highlight-rect')
            .data((d) => d.series[0].data)
            .join(
                (enter) => {
                    return enter.append('rect').attr('class', 'highlight-rect');
                },
                (update) => update,
                (exit) => exit.remove()
            )
            .attr('x', (_d, i) => i * barDimensions.singleSize)
            .attr('y', chartMetrics.yRange[1])
            .attr('width', barDimensions.singleSize)
            .attr('height', chartMetrics.chartHeight)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .on('mouseenter', (_d, i, k) => {
                const rect = k[i];
                select(rect).attr('fill', 'rgba(222, 222, 222, .17)');
            })
            .on('mouseleave', (_d, i, k) => {
                const rect = k[i];
                select(rect).attr('fill', 'none');
            });

        barContainer
            .selectAll('g.bar-group')
            .data((d) => d.series[0].data)
            .join(
                (enter) => {
                    return enter.append('g').attr('class', 'bar-group');
                },
                (update) => update,
                (exit) => exit.remove()
            )
            .call(this._addBarGroups(data, barDimensions));

        // draw x axis
        if (chartMetrics.xAxisPoints) {
            const group = svg
                .selectAll('g.x-axis')
                .data(
                    chartMetrics.xAxisPoints ? [chartMetrics.xAxisPoints] : []
                )
                .join(
                    (enter) => enter.append('g').attr('class', 'x-axis'),
                    (update) => update,
                    (exit) => exit.remove()
                );

            const labels = group
                .selectAll('text.x-axis-label')
                .data(chartMetrics.xAxisPoints);

            labels
                .enter()
                .append('text')
                .classed('x-axis-label', true)
                .merge(svg.selectAll('text.x-axis-label') as any)
                .text((d) => d.text)
                .attr('text-anchor', 'middle')
                .attr(
                    'x',
                    (d) =>
                        d.x * barDimensions.singleSize +
                        barDimensions.singleSize / 2
                )
                .attr('y', chartMetrics.xAxisLabelStart)
                .style('font-size', '13px')
                .each((d, i, labelSelection) => {
                    const label = labelSelection[i];
                    if (data.xAxis.labelRotation) {
                        const xy = {
                            x: Number(label.getAttribute('x')),
                            y: Number(label.getAttribute('y')),
                        };

                        select(label).attr(
                            'transform',
                            `rotate(${data.xAxis.labelRotation}, ${xy.x}, ${xy.y})`
                        );
                    }
                });

            labels.exit().remove();
        }
    }

    private _addBarGroups(data: SaChartData, barDimensions: BarDimensions) {
        return (
            sel: Selection<SVGGElement, (number | number[])[], any, any>
        ) => {
            sel.each((d, i, barGroups) => {
                const barGroup = select(barGroups[i]);

                const bars = barGroup
                    .selectAll('g.bar')
                    .data(d.slice(1))
                    .join(
                        (enter) => {
                            return enter.append('g').attr('class', 'bar');
                        },
                        (update) => update,
                        (exit) => exit.remove()
                    )
                    .style(
                        'transform',
                        `translateX(${barDimensions.itemGap}px)`
                    );

                bars.call(this._addBars(data, barDimensions, i));
            });
        };
    }

    private _addBars(
        data: SaChartData,
        barDimensions: BarDimensions,
        groupIndex: number
    ) {
        return (sel: Selection<SVGGElement, number | number[], any, any>) => {
            sel.each((d, i, bars) => {
                const currentBar = select(bars[i]);
                const barData = d as number[];
                let start = barDimensions.yScale(0);
                const itemData: BarItemData[] = [];

                for (let k = 0; k < barData.length; k++) {
                    const lowY = start;
                    start = barDimensions.yScale(
                        barData[k] + (k !== 0 ? barData[k - 1] : 0)
                    );
                    const item: BarItemData = {
                        startY: start,
                        startX: groupIndex * barDimensions.singleSize,
                        height: lowY - start,
                        width: barDimensions.barWidth,
                        data: barData[k],
                        rounded: barData.length - 1 === k,
                        color: data.series[0].color[i][k],
                    };
                    item.startX +=
                        i * (barDimensions.gap + barDimensions.barWidth);

                    itemData.push(item);
                }

                const yRectDems = currentBar
                    .selectAll('rect.bar-item')
                    .data(itemData)
                    .join(
                        (enter) =>
                            enter.append('rect').attr('class', 'bar-item'),
                        (update) => update,
                        (exit) => exit.remove()
                    )
                    .attr('x', (item) => item.startX)
                    .attr('y', (item) => item.startY)
                    .attr('width', (item) => item.width)
                    .attr('height', (item) => item.height)
                    .attr('fill', (item) => item.color);
            });
        };
    }
}

interface BarDimensions {
    itemCount: number;
    barCount: number;
    singleSize: number;
    barWidth: number;
    gap: number;
    itemGap: number;
    yScale: ScaleLinear<number, number>;
}

interface BarItemData {
    startY: number;
    startX: number;
    height: number;
    width: number;
    data: number;
    rounded: boolean;
    color: string;
}
