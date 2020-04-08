import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    HostListener,
    AfterViewInit,
} from '@angular/core';
import { SaChartData, SaChartDimensions } from '../../models/chart-data.model';
import { BarChart } from '../../charts/bar-chart';
import { BarChartConfig } from '../../models/bar-chart-config.model';

@Component({
    selector: 'sa-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
})
export class SaBarChartComponent implements AfterViewInit {
    /**
     * field for data
     */
    private _data: SaChartData;

    /**
     * data for the chart
     */
    @Input()
    public get data() {
        return this._data;
    }
    public set data(v: SaChartData) {
        this._data = v;
        this._render();
    }

    /**
     * Chart dimensions
     */
    private _dimensions: SaChartDimensions;

    @Input()
    public get dimensions() {
        return this._dimensions;
    }
    public set dimensions(v: SaChartDimensions) {
        this._dimensions = v;
        this._render();
    }

    private _legend: { color: string; name: string }[];

    /**
     * legends
     */
    @Input()
    public get legend() {
        return this.legend;
    }
    public set legend(val) {
        this._legend = val;
        this._render();
    }

    /**
     * container of the chart
     */
    @ViewChild('container')
    public chartContainer: ElementRef;

    /**
     * chart class
     */
    private _chart: BarChart;

    /**
     * construct the class
     */
    constructor() {
        this._chart = new BarChart();
    }

    /**
     * handle page resize
     */
    @HostListener('window:resize')
    public onResize() {
        this._render();
    }

    /**
     * handle view init
     */
    public ngAfterViewInit() {
        this._render();
    }

    /**
     * render the chart onto the chart container
     */
    private _render() {
        if (
            this.data &&
            this.chartContainer &&
            this.chartContainer.nativeElement
        ) {
            const config: BarChartConfig = {
                dimensions: this._dimensions,
                legend: this._legend,
            };

            this._chart.render(
                this.data,
                this.chartContainer.nativeElement,
                config
            );
        }

        if (
            !this.data &&
            this.chartContainer &&
            this.chartContainer.nativeElement
        ) {
            console.error('Please give a valid data.');
        }
    }
}
