import { Component, OnDestroy, OnInit } from '@angular/core';
import { IdleService } from './services/auth/idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Credilink';

  constructor(private idleService: IdleService) {}

  ngOnInit(): void {
    this.idleService.resetTimer();
  }

  ngOnDestroy(): void {
    this.idleService.stopWatching();
  }
}
