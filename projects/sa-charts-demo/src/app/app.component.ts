import { Component } from '@angular/core';
import { SaLineChartData, curveTypes } from 'ng-sa-charts';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    curveTypes = curveTypes;
    data: SaLineChartData = {
        series: [
            {
                data: [0, 1, 3, 4, 0, 10, 5, 5, 3, 7, 14, 10],
                name: 'Series - A',
                color: 'green'
            }
        ],
        xAxis: {
            title: 'Months',
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        }
    };

    addSeries() {
        this.data.series.push(this.getNewSeries(12));
        this.data = {
            series: this.data.series,
            xAxis: this.data.xAxis
        };
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
        for (let i = 0; i < this.data.series.length; i++) {
            this.data.series[i] = this.getNewSeries(12);
        }

        this.data = {
            series: this.data.series,
            xAxis: this.data.xAxis
        };
    }
}
