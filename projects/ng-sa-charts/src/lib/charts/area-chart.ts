import { Chart } from './chart.interface';
import { SaChartData, LineChartConfig } from '../models/line-data.model';
import { SaChartDimensions } from '../models/chart-data.model';
import {
    scaleOrdinal,
    select,
    schemeCategory10,
    scaleLinear,
    line,
    area
} from 'd3';
import {
    defineColorFadingGradient,
    getIdFromColor
} from '../helpers/gradient.helpers';
import { getCurveFromString } from '../helpers/curve.helpers';

export class AreaChart implements Chart<SaChartData, LineChartConfig> {
    private _dems: SaChartDimensions = {
        margins: {
            top: 10,
            bottom: 10
        }
    };

    render(data: SaChartData, container: HTMLElement, config: LineChartConfig) {
        const colorScale = scaleOrdinal(schemeCategory10);
        const svgContainer = select(container);

        // dimensions
        // const width = svgContainer.node().getBoundingClientRect().width;
        // const height = width * 0.4;
        // const dataPoints = data.xAxis.labels.length;
        // let yAxisMax = Math.max(...data.series.map(x => Math.max(...x.data)));
        // yAxisMax += 0.1 * yAxisMax;
        // let yAxisMin = Math.min(
        //     0,
        //     ...data.series.map(x => Math.min(...x.data))
        // );
        // yAxisMin -= 0.1 * yAxisMin;

        // // create the svg
        // let svg = svgContainer.select('svg').datum(data);

        // if (!svg.node()) {
        //     svg = svgContainer.insert('svg').datum(data);
        // }

        // svg = svg.attr('width', width).attr('height', height);

        // // add defs for gradients
        // svg.select('defs').remove();
        // const defs = svg.append('defs');

        // for (const i in data.series) {
        //     if (data.series[i]) {
        //         const series = data.series[i];

        //         defineColorFadingGradient(
        //             series.color || colorScale(i.toString()),
        //             defs
        //         );
        //     }
        // }

        // const chartHeight = height - this._dems.margins.top;

        // const xScale = scaleLinear()
        //     .domain([0, dataPoints - 1])
        //     .range([0, width]);

        // const yScale = scaleLinear()
        //     .domain([yAxisMin, yAxisMax])
        //     .range([chartHeight, 0 + this._dems.margins.bottom]);

        // const lineGenerator = line<number>()
        //     .x((d, i) => {
        //         return xScale(i);
        //     })
        //     .y((d: number, i) => {
        //         return yScale(d);
        //     })
        //     .curve(getCurveFromString(config.curve));

        // const areaGenerator = area<number>()
        //     .x((d, i) => {
        //         return xScale(i);
        //     })
        //     .y0((d: number, i) => yScale(d))
        //     .y1(chartHeight)
        //     .curve(getCurveFromString(config.curve) as any);

        // svg.selectAll('path.sa-area-path')
        //     .data(d => d.series)
        //     .enter()
        //     .insert('path')
        //     .classed('sa-area-path', true)
        //     .merge(svg.selectAll('path.sa-area-path'))
        //     .attr('d', d => {
        //         return areaGenerator(d.data);
        //     })
        //     .attr(
        //         'fill',
        //         (d, i) =>
        //             `url(${getIdFromColor(
        //                 d.color || colorScale(i.toString())
        //             )})`
        //     )
        //     .attr('stroke', 'none')
        //     .attr('style', `transform: translateY(${this._dems.margins.top}px)`)
        //     .exit()
        //     .remove();

        // svg.selectAll('path.sa-path')
        //     .data(d => d.series)
        //     .enter()
        //     .insert('path')
        //     .classed('sa-path', true)
        //     .merge(svg.selectAll('path.sa-path'))
        //     .attr('d', d => {
        //         return lineGenerator(d.data);
        //     })
        //     .attr('fill', 'none')
        //     .attr('stroke-width', config.strokeWidth)
        //     .attr('stroke', (d, i) => d.color || colorScale(i.toString()))
        //     .attr('style', `transform: translateY(${this._dems.margins.top}px)`)
        //     .exit()
        //     .remove();
    }
}
