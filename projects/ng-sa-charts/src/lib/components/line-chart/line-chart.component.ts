import {
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input,
    HostListener
} from '@angular/core';
import { LineChart } from '../../charts/line-chart-mini';
import { SaChartDimensions, SaChartData } from '../../models/chart-data.model';
import { LineChartConfig } from '../../models/line-data.model';

@Component({
    selector: 'sa-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class SaLineChartComponent implements AfterViewInit {
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
     * determines whether area needs to be shown or not
     */
    private _showArea = false;
    @Input()
    public get showArea() {
        return this._showArea;
    }
    public set showArea(val) {
        this._showArea = val;
        this._render();
    }

    /**
     * which type of curve to use to represent
     */
    private _curve: string;

    @Input()
    public get curve() {
        return this._curve;
    }
    public set curve(val: string) {
        this._curve = val;
        this._render();
    }

    /**
     * stroke width of the chart lines
     */
    private _strokeWidth = 1;

    @Input()
    public get strokeWidth() {
        return this._strokeWidth;
    }
    public set strokeWidth(val: number) {
        this._strokeWidth = val;
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

    /**
     * container of the chart
     */
    @ViewChild('container')
    public chartContainer: ElementRef;

    /**
     * chart class
     */
    private _chart: LineChart;

    /**
     * construct the class
     */
    constructor() {
        this._chart = new LineChart();
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
            const config: LineChartConfig = {
                curve: this.curve,
                showArea: this.showArea,
                strokeWidth: this._strokeWidth,
                dimensions: this._dimensions
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
