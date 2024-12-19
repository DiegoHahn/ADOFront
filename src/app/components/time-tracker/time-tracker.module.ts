import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ActivityFormComponent } from "./activity-form/activity-form.component";
import { ControlButtonsComponent } from "./control-buttons/control-buttons.component";
import { LoginComponent } from "./login/login.component";
import { PersonalDataService } from "./personal-data.service";
import { PersonalDataComponent } from "./personal-data/personal-data.component";
import { TimeTrackerRountingModule } from "./time-tracker.rounting.module";
import { TimerService } from "./timer.service";
import { WorkItemService } from "./work-item.service";

@NgModule({
    declarations: [
      ActivityFormComponent,
      ControlButtonsComponent,
      LoginComponent,
      PersonalDataComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      TimeTrackerRountingModule,
      RouterModule
    ],
    providers: [TimerService, WorkItemService, PersonalDataService]
  })
  export class TimeTrackerModule { }