import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequestDto, LoginResponseDto, Sede } from 'src/app/interfaces/auth.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}
    /**
   * Método para hacer login
   * @param loginRequest - Datos de solicitud de login (usuario y contraseña)
   * @returns Observable con la respuesta del servidor (token, datos del usuario)
   */
    login(loginRequest: LoginRequestDto): Observable<LoginResponseDto> {
      return this.http.post<LoginResponseDto>(`${environment.apiUrl}/login/`, loginRequest)
        .pipe(
          catchError((error) => {
            console.error('Error durante el login:', error);
            return throwError(error);
          })
        );
    }
  
    /**
     * Método para almacenar el token de autenticación en localStorage
     * @param token - Token JWT
     */
    setToken(token: string): void {
      localStorage.setItem('auth_token', token);
    }

    setSedeUserToStorage(sede: string): void {
      localStorage.setItem('sede_user', sede);
    }
  
    /**
     * Método para obtener el token de autenticación desde localStorage
     * @returns Token JWT o null si no está presente
     */
    getToken(): string | null {
      return localStorage.getItem('auth_token');
    }
  
    getSedeUser(): string | null {
      return localStorage.getItem('sede_user');
    }
    /**
     * Método para eliminar el token de autenticación de localStorage
     */
    clearToken(): void {
      localStorage.removeItem('auth_token');
    }
  
    /**
     * Método para verificar si el usuario está autenticado
     * @returns true si el usuario está autenticado, false si no lo está
     */
    isAuthenticated(): boolean {
      return !!this.getToken(); // Retorna true si hay un token
    }


    logout(): void {
      localStorage.removeItem('auth_token'); 
      this.router.navigate(['/authentication/login']); 
    }

}
