import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'activity-tracker', pathMatch: 'full' },
    {
        path: 'activity-tracker',
        loadChildren: () => import('./components/time-tracker/time-tracker.module').then(m => m.TimeTrackerModule)
    },
    {
      path: 'reports',
      loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule)
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }