import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SaLineChartComponent } from './components/line-chart/line-chart.component';
import { SaBarChartComponent } from './components/bar-chart/bar-chart.component';

@NgModule({
    declarations: [SaLineChartComponent, SaBarChartComponent],
    imports: [],
    exports: [SaLineChartComponent, SaBarChartComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgSaChartsModule {}
