import { Component } from '@angular/core';
import { SaChartData, curveTypes } from 'ng-sa-charts';
import { toChartData, generateData, generateBarData } from './data';
import { SaChartDimensions } from 'projects/ng-sa-charts/src/public-api';
import { timeDay, timeMonth, timeHour, CountableTimeInterval } from 'd3';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    dems: SaChartDimensions = {
        width: 440,
        height: 300,
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    };

    testData = {
        status: true,
        message: 'Success',
        debugMessage: null,
        data: {
            completed: 136,
            pending: 32,
            data: [
                { time: 1594771200000, value: 0 },
                { time: 1594857600000, value: 0 },
                { time: 1594944000000, value: 0 },
                { time: 1595030400000, value: 0 },
                { time: 1595116800000, value: 0 },
                { time: 1595203200000, value: 0 },
                { time: 1595289600000, value: 0 },
                { time: 1595376000000, value: 136 },
            ],
        },
    };

    respDems = {
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    };

    curveTypes = curveTypes;

    data: SaChartData = {
        series: [
            {
                // data: toChartData(generateData(timeHour, 1, 30)),
                data: this.testData.data.data.map((x) => [x.time, x.value]),
                name: 'Series - A',
                color: 'green',
            },
        ],
        xAxis: {
            timeData: true,
            extendAreaToAxis: true,
            // labelTransforms: 'rotate(70 30)',
            disabled: false,
            labelRotation: 335,
        },
    };

    data2: SaChartData = {
        series: [
            {
                data: toChartData(generateData(timeDay, 1, 20)),
                name: 'Series-Test',
                color: 'green',
            },
        ],
        xAxis: {
            timeData: true,
            extendAreaToAxis: true,
            // labelTransforms: 'rotate(70 30)',
            disabled: false,
            labelRotation: 335,
            uppercase: true,
        },
    };

    barData: SaChartData = {
        series: [
            {
                name: 'Some Name',
                // data: toChartData(generateBarData(timeHour, 1, 24)),
                data: [
                    [1586345400000, [3, 46], [27, 29]],
                    [1586349000000, [10, 73], [70, 28]],
                    [1586352600000, [22, 32], [94, 21]],
                    [1586356200000, [46, 55], [53, 11]],
                ],
                color: [
                    ['#00BA56', '#E58320'],
                    ['#E58320', '#00BA56'],
                ],
            },
        ],
        xAxis: {
            timeData: true,
            labelRotation: 335,
            ticks: 8,
            extendAreaToAxis: true,
        },
    };

    barlegends = [
        { color: '#00BA56', name: 'TAT Within Limit' },
        { color: '#E58320', name: 'TAT Exceed Limit' },
    ];

    barDems: SaChartDimensions = {
        width: 440,
        height: 300,
        margins: {
            top: 10,
            bottom: 50,
            left: 20,
            right: 30,
        },
    };

    constructor() {}

    updateBarData() {
        this.barData = {
            series: [
                {
                    name: 'New name',
                    data: toChartData(
                        generateBarData(
                            timeHour,
                            1,
                            Math.round(Math.random() * 24)
                        )
                    ),
                    color: [
                        ['#00BA56', '#E58320'],
                        ['#E58320', '#00BA56'],
                    ],
                },
            ],
            xAxis: this.barData.xAxis,
        };
    }

    private _generateLineData(
        interval: CountableTimeInterval,
        step: number,
        periodInInterval: number
    ) {
        const start = interval.floor(new Date());
        const end = interval.offset(start, periodInInterval);

        const range = interval.range(start, end, step);
        return range.map((d) => ({
            time: d.getTime(),
            value: Math.round(Math.random() * 100),
        }));
    }
}
