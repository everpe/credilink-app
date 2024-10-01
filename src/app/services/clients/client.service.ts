import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateClientDto, JobRelationship, UpdateClientDto } from 'src/app/interfaces/client.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  // Método para obtener la lista paginada de clientes
  getClients(offset: number, limit: number, sede: number, search: string): Observable<any> {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('sede', sede)
      .set('search', search);
    return this.http.get(`${environment.apiUrl}/clients/`, { params });
  }

  createClient(newClient: CreateClientDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/clients/`, newClient);
  }

  getJobRelationships(sede: number): Observable<JobRelationship[]> {
    return this.http.get<JobRelationship[]>( `${environment.apiUrl}/job_relationships/?sede=${sede}`);
  }

  updateClient(id: number, updateClientDto: UpdateClientDto): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/clients/${id}/`, updateClientDto);
  }
  
}
