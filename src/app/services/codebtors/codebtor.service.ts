import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoDebtor, CreateCoDebtorDto, UpdateCoDebtorDto } from 'src/app/interfaces/co-debtor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodebtorService {

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de codeudores con paginación
  getCoDebtors(offset: number, limit: number, sede: number, search: string): Observable<{ count: number, results: CoDebtor[] }> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('sede', sede.toString())
      .set('search', search);;

    return this.http.get<{ count: number, results: CoDebtor[] }>(`${environment.apiUrl}/CoDebtor/`, { params });
  }

  createCoDebtor(coDebtor: CreateCoDebtorDto): Observable<any> {
    return this.http.post<any>(environment.apiUrl, coDebtor);
  }

  updateCoDebtor(id: number, updateCoDebtorDto: UpdateCoDebtorDto): Observable<any> {
    const url = `${environment.apiUrl}}/api/CoDebtor/${id}/`;
    return this.http.patch(url, updateCoDebtorDto);
  }

  deleteClientById(coDebtorId: number): Observable<void> {
    const url = `${environment.apiUrl}/CoDebtor/${coDebtorId}/`;
    return this.http.delete<void>(url);
  }

}
