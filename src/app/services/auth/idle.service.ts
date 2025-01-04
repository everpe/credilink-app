import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private readonly INACTIVITY_LIMIT = 5 * 60; // 5 minutos en segundos

  constructor(private idle: Idle, private router: Router) {
    this.setupIdle();
  }

  private setupIdle(): void {
    // Configurar el tiempo de inactividad y tiempo de espera
    this.idle.setIdle(this.INACTIVITY_LIMIT); // Tiempo de espera para detectar inactividad
    this.idle.setTimeout(30); // Tiempo adicional antes de cerrar sesión
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Evento cuando la sesión está a punto de expirar
    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      console.warn(`La sesión expirará en ${countdown} segundos`);
    });

    // Evento cuando la sesión ha expirado
    this.idle.onTimeout.subscribe(() => {
      console.warn('Sesión expirada por inactividad');
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['authentication/login']);
    });

    // Iniciar el monitoreo
    this.idle.watch();
    console.log('IdleService iniciado');
  }

  stopWatching(): void {
    this.idle.stop();
    console.log('IdleService detenido');
  }

  resetTimer(): void {
    this.idle.watch();
    console.log('IdleService reiniciado');
  }
}
