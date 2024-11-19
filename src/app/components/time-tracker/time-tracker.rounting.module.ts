import { RouterModule, Routes } from "@angular/router";
import { PersonalDataComponent } from "./personal-data/personal-data.component";
import { ActivityFormComponent } from "./activity-form/activity-form.component";
import { LoginComponent } from "./login/login.component";
import { NgModule } from "@angular/core";

const routes: Routes = [

    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'personal-data',
        component: PersonalDataComponent
    },
    {
        path: 'activity-form',
        component: ActivityFormComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TimeTrackerRountingModule { }
