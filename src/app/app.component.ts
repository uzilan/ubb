import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  phase = Phase.Welcome
  PhaseType = Phase
}

enum Phase {
  Welcome,
  HowMany,
  Game
}
