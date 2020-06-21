import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    HostListener,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { SaChartData, SaChartDimensions } from '../../models/chart-data.model';
import { BarChart } from '../../charts/bar-chart';
import { BarChartConfig } from '../../models/bar-chart-config.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'sa-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
})
export class SaBarChartComponent implements AfterViewInit, OnDestroy {
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

    private _tooltipEnabled = false;

    /**
     * if true the chart will show y axis tooltip when hovered on
     */
    @Input()
    public get tooltip() {
        return this._tooltipEnabled;
    }
    public set tooltip(v: boolean) {
        this._tooltipEnabled = v;
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

    private _heightFactor = 0.4;

    /**
     * height factor for the chart
     */
    @Input()
    public get heightFactor() {
        return this._heightFactor;
    }
    public set heightFactor(v: number) {
        this._heightFactor = v;
        this._render();
    }

    /**
     * renders should be notified here
     */
    private $render = new Subject<void>();

    private $destroy = new Subject<void>();

    private $renderRequests = this.$render
        .asObservable()
        .pipe(takeUntil(this.$destroy), debounceTime(200));

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

        this.$renderRequests.subscribe(() => this._renderChart());
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
     * any new render requests should be initiated by calling this method
     */
    private _render() {
        this.$render.next();
    }

    /**
     * render the chart onto the chart container
     */
    private _renderChart() {
        if (
            this.data &&
            this.chartContainer &&
            this.chartContainer.nativeElement
        ) {
            const config: BarChartConfig = {
                dimensions: this._dimensions,
                legend: this._legend,
                heightFactor: this.heightFactor,
                tooltipEnabled: this._tooltipEnabled,
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

    public ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
