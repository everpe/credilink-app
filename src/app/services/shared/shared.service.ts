import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private reloadCreditsSource = new BehaviorSubject<boolean>(false);
  reloadCredits$ = this.reloadCreditsSource.asObservable();

  // Método para emitir el evento cuando se crea un nuevo crédito
  triggerReloadCredits() {
    this.reloadCreditsSource.next(true);
  }
}
