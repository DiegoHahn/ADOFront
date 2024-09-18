import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { ActivityFormComponent } from './components/activity-form/activity-form.component';


export const routes: Routes = [
    { path:  'activity-form',
        component: ActivityFormComponent
    },
    { path: 'personal-data',
        component: PersonalDataComponent 
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }