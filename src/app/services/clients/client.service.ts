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
 
  deleteClientById(clientId: number): Observable<void> {
    const url = `${environment.apiUrl}/clients/${clientId}/`;
    return this.http.delete<void>(url);
  }

  
  downloadClientReport(sede: number): void {
    const url = `${environment.apiUrl}/clients/exports/?sede=${sede}`;
    
    // Hacemos la petición para descargar el archivo
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      // Crear un enlace para descargar el archivo
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'reporte_clientes.xlsx';  // Nombre del archivo
      link.click();  // Descargar automáticamente
    }, error => {
      console.error('Error al descargar el reporte:', error);
    });
  }


  addJobRelationship(sede: number, name: string): Observable<any> {
    const body = {
      sede: sede,
      name: name
    };
    return this.http.post<any>(`${environment.apiUrl}/job_relationships/`, body);
  }
}
