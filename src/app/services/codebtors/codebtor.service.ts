import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoDebtorDto, CreateCoDebtorDto, UpdateCoDebtorDto } from 'src/app/interfaces/co-debtor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodebtorService {

  constructor(private http: HttpClient) {}

  getCoDebtors(offset: number, limit: number, sede: number, search: string): Observable<{ count: number, results: CoDebtorDto[] }> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sede', sede.toString())
      .set('search', search);;

    return this.http.get<{ count: number, results: CoDebtorDto[] }>(`${environment.apiUrl}/CoDebtor/`, { params });
  }

  createCoDebtor(coDebtor: CreateCoDebtorDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/CoDebtor/`, coDebtor);
  }

  updateCoDebtor(id: number, updateCoDebtorDto: UpdateCoDebtorDto): Observable<any> {
    const url = `${environment.apiUrl}/CoDebtor/${id}/`;
    return this.http.patch(url, updateCoDebtorDto);
  }

  deleteClientById(coDebtorId: number): Observable<void> {
    const url = `${environment.apiUrl}/CoDebtor/${coDebtorId}/`;
    return this.http.delete<void>(url);
  }

  downloadCodebtorReport(sede: number): void {
    const url = `${environment.apiUrl}/CoDebtor/exports/?sede=${sede}`;
    
    // Hacemos la petición para descargar el archivo
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      // Crear un enlace para descargar el archivo
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'reporte_codeudores.xlsx';  // Nombre del archivo
      link.click();  // Descargar automáticamente
    }, error => {
      console.error('Error al descargar el reporte:', error);
    });
  }

}
