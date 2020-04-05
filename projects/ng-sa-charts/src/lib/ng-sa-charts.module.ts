import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SaLineChartMiniComponent } from './components/line-chart-mini/line-chart-mini.component';
import { SaAreaChartComponent } from './components/area-chart/area-chart.component';

@NgModule({
    declarations: [SaLineChartMiniComponent, SaAreaChartComponent],
    imports: [],
    exports: [SaLineChartMiniComponent, SaAreaChartComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgSaChartsModule {}
