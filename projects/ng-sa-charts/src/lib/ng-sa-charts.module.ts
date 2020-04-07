import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SaLineChartComponent } from './components/line-chart/line-chart.component';

@NgModule({
    declarations: [SaLineChartComponent],
    imports: [],
    exports: [SaLineChartComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgSaChartsModule {}
