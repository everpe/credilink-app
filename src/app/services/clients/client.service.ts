import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  // Método para obtener la lista paginada de clientes
  getClients(offset: number, limit: number, sede: number, search: string): Observable<any> {
    // Crear los parámetros de la solicitud GET
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('sede', sede)
      .set('search', search);

    // Realizar la solicitud GET con los parámetros
    return this.http.get(`${environment.apiUrl}/clients/`, { params });
  }
}
