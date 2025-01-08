import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequestDto, LoginResponseDto, Sede } from 'src/app/interfaces/auth.interface';
import { ChangePasswordResponse } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly KEY_USER_LOGGED = 'user_logged';
  private readonly KEY_DATE_LOGGED = 'date_logged';
  private readonly KEY_SEDE_USER = 'sede_user';
  private readonly KEY_JWT = 'auth_token';
  private readonly KEY_TYPE_USER = 'type_user';


  constructor(private http: HttpClient, private router: Router) { }
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
   * Método para eliminar el token de autenticación de localStorage
   */
  clearToken(): void {
    localStorage.removeItem(this.KEY_JWT);
  }

  /**
   * Método para verificar si el usuario está autenticado
   * @returns true si el usuario está autenticado, false si no lo está
   */
  isAuthenticated(): boolean {
    return !!this.getToken(); // Retorna true si hay un token
  }


  logout(): void {
    localStorage.removeItem(this.KEY_JWT);
    localStorage.removeItem(this.KEY_SEDE_USER);
    localStorage.removeItem(this.KEY_USER_LOGGED);
    localStorage.removeItem(this.KEY_DATE_LOGGED);
    localStorage.removeItem(this.KEY_TYPE_USER);
    this.router.navigate(['/authentication/login']);
  }


  /**
   * Método para almacenar el token de autenticación en localStorage
   * @param token - Token JWT
   */
  setToken(token: string): void {
    localStorage.setItem(this.KEY_JWT, token);
  }

  setSedeUserToStorage(sede: string): void {
    localStorage.setItem(this.KEY_SEDE_USER, sede);
  }

  setUserLogged(userName: string): void {
    localStorage.setItem(this.KEY_USER_LOGGED, userName);
  }
  setDateLogged(date: Date): void {
    localStorage.setItem(this.KEY_DATE_LOGGED, date.toISOString()); // Convertimos el Date a string
  }
  setTypeUserLogged(type: string): void {
    localStorage.setItem(this.KEY_TYPE_USER, type);
  }


  /**
   * Método para obtener el token de autenticación desde localStorage
   * @returns Token JWT o null si no está presente
   */
  getToken(): string | null {
    return localStorage.getItem(this.KEY_JWT);
  }

  getSedeUser(): string | null {
    return localStorage.getItem(this.KEY_SEDE_USER);
  }

  getDateLogged(): Date | null {
    const dateStr = localStorage.getItem(this.KEY_DATE_LOGGED); // Recuperamos el string
    return dateStr ? new Date(dateStr) : null; // Convertimos el string a Date
  }

  getUserLogged(): string | null {
    return localStorage.getItem(this.KEY_USER_LOGGED);
  }

  getTypeUserLogged(): string | null {
    return localStorage.getItem(this.KEY_TYPE_USER);
  }

   /**
   * Cambia la contraseña de un usuario.
   * @param userId ID del usuario
   * @param password Nueva contraseña
   * @param passwordConfirm Confirmación de la contraseña
   * @returns Observable con la respuesta de la API
   */
   changePassword(userId: number, password: string, passwordConfirm: string): Observable<ChangePasswordResponse> {
    const url = `${environment.apiUrl}/users/${userId}/change_password/`;
    const body = {
      password: password,
      password_confirm: passwordConfirm
    };
    return this.http.put<ChangePasswordResponse>(url, body);
  }

}
