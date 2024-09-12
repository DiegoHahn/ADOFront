// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { ActivityFormComponent } from "./components/activity-form/activity-form.component";

import { Component } from "@angular/core";

// @Component({
//   selector: 'app-root',
//   // standalone: true,
//   // imports: [RouterOutlet, ActivityFormComponent],
//   templateUrl: './app.component.html',
// })
// export class AppComponent {
//   title = 'ActivityTracker';
// }

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Minha Aplicação Angular</h1>
      <app-activity-form></app-activity-form>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Minha Aplicação Angular';
}