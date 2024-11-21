import { RouterModule, Routes } from "@angular/router";
import { UserActivityComponent } from "./user-activity/user-activity.component";
import { NgModule } from "@angular/core";

const routes: Routes = [

    {
        path: 'user-activity',
        component: UserActivityComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReportsRountingModule { }