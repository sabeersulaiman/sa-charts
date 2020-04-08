import { Component } from '@angular/core';
import { SaChartData, curveTypes } from 'ng-sa-charts';
import { toChartData, generateData, generateBarData } from './data';
import { SaChartDimensions } from 'projects/ng-sa-charts/src/public-api';
import { timeDay, timeMonth, timeHour } from 'd3';

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

    curveTypes = curveTypes;

    data: SaChartData = {
        series: [
            {
                data: toChartData(generateData(timeHour, 1, 30)),
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
}
