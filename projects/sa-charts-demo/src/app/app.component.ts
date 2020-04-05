import { Component } from '@angular/core';
import { SaChartData, curveTypes } from 'ng-sa-charts';
import { toChartData, generateData } from './data';
import { SaChartDimensions } from 'projects/ng-sa-charts/src/public-api';
import { timeDay, timeMonth, timeHour } from 'd3';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    dems: SaChartDimensions = {
        width: 440,
        height: 300,
        margins: {
            top: 100,
            bottom: 50,
            left: 0,
            right: 0
        }
    };
    curveTypes = curveTypes;
    data: SaChartData = {
        series: [
            {
                data: toChartData(generateData(timeHour, 1, 30)),
                name: 'Series - A',
                color: 'green'
            }
        ],
        xAxis: {
            timeData: true,
            extendAreaToAxis: true,
            // labelTransforms: 'rotate(70 30)',
            disabled: false,
            labelRotation: 335
        }
    };

    addSeries() {
        // this.data.series.push(this.getNewSeries(12));
        // this.data = {
        //     series: this.data.series,
        //     xAxis: this.data.xAxis
        // };
    }

    getNewSeries(count: number) {
        const nums: number[] = [];
        for (let i = 0; i < count; i++) {
            const num = Math.floor(Math.random() * 11);
            nums.push(num);
        }

        return {
            data: nums,
            title: 'Series ' + Math.floor(Math.random() * 25)
        };
    }

    updateSeries() {
        // for (let i = 0; i < this.data.series.length; i++) {
        //     this.data.series[i] = this.getNewSeries(12);
        // }
        // this.data = {
        //     series: this.data.series,
        //     xAxis: this.data.xAxis
        // };
    }
}
