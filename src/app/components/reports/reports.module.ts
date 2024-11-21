import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ReportsRountingModule } from "./reports.rounting.module";
import { UserActivityComponent } from "./user-activity/user-activity.component";

@NgModule({
    declarations: [
        UserActivityComponent
    ],
    imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      ReportsRountingModule,
      RouterModule
    ],
    providers: []
  })
  export class ReportsModule { }