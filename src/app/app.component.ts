import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivityFormComponent } from "./components/activity-form/activity-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ActivityFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ActivityTracker';
}
