import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto, UserResponse } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(offset: number, limit: number, sede: number, search: string): Observable<UserResponse> {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sede', sede.toString())
      .set('search', search);

    return this.http.get<UserResponse>(`${environment.apiUrl}/users/`, { params });
  }

  createUser(user: CreateUserDto): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/users/`, user);
  }

  updateUser(userId: number, userData: UpdateUserDto): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${environment.apiUrl}/users/${userId}/`, userData);
  }

  deleteUserById(userId: number): Observable<UserResponse> {
    const url = `${environment.apiUrl}/users/${userId}/`;
    return this.http.delete<UserResponse>(url);
  }

}
