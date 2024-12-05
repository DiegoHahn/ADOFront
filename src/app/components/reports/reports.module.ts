import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UserActivityComponent } from "./user-activity/user-activity.component";
import { ReportsRoutingModule } from "./reports.routing.module";
import { ActivityRecordService } from "./activity-record.service";

@NgModule({
  declarations: [
      UserActivityComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    RouterModule
  ],
  providers: [ActivityRecordService, DatePipe]
})
export class ReportsModule { }