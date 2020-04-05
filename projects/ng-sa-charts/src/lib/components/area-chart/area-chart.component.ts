import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { SaChartData } from '../../models/chart-data.model';

@Component({
    selector: 'sa-area-chart',
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.scss']
})
export class SaAreaChartComponent {
    /**
     * data field
     */
    private _data: SaChartData;

    /**
     * data input property
     */
    @Input()
    public get data() {
        return this._data;
    }
    public set data(val: SaChartData) {
        this._data = val;
        this._render();
    }

    /**
     * width of the chart
     */
    private _width: number;

    /**
     * width property
     */
    @Input()
    public get width() {
        return this._width;
    }
    public set width(val: number) {
        this._width = val;
        this._render();
    }

    /**
     * height of the chart
     */
    private _height: number;

    /**
     * height property
     */
    public get height() {
        return this._height;
    }
    public set height(val: number) {
        this._height = val;
        this._render();
    }

    /**
     * stroke width of the chart lines
     */
    private _strokeWidth = 1;

    /**
     * stroke width property
     */
    public get strokeWidth() {
        return this._strokeWidth;
    }
    public set strokeWidth(val: number) {
        this._strokeWidth = val;
        this._render();
    }

    /**
     * curve type to be used in chart
     */
    private _curve: string;

    /**
     * curve type of chart lines
     */
    public get curve() {
        return this._curve;
    }
    public set curve(val: string) {
        this._curve = val;
        this._render();
    }

    /**
     * container of the chart
     */
    @ViewChild('container')
    public chartContainer: ElementRef;

    /**
     * DI constructor
     */
    constructor() {}

    /**
     * render the chart
     */
    private _render() {}
}
