import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditDto, GetCreditDto } from 'src/app/interfaces/credit.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient) {}


  createCredit(creditData: CreditDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiUrl}/credits/`, creditData, { headers });
  }


  getCredits(sede: number, offset: number = 0, limit: number = 20): Observable<GetCreditDto[]> {
    let params = new HttpParams()
      .set('sede', sede.toString());
      // .set('offset', offset.toString())
      // .set('limit', limit.toString());

    return this.http.get<GetCreditDto[]>(`${environment.apiUrl}/credits/`, { params });
  }


  filterCredits(filters: any): Observable<GetCreditDto[]> | void {
    console.log(filters);      
    // Crear los parámetros con los filtros
    let params = new HttpParams()
      .set('sede', filters.sede.toString())
      .set('load_status', filters.load_status)
      .set('created_at_after', filters.created_at_after)
      .set('created_at_before', filters.created_at_before)
;

    // Si `client` no está vacío, lo agregamos a los parámetros
    if (filters.client) {
      params = params.set('client', filters.client);
    }

    // Si `co_debtor` no está vacío, lo agregamos a los parámetros
    if (filters.co_debtor ) {
      params = params.set('co_debtor', filters.co_debtor);
    }

    // Si `export` es true, esperamos un archivo binario (excel) en la respuesta
    if (filters.export) {
      params = params.set('export', Boolean(filters.export ?? false));
      return this.exportExcel(params);
    }

    // Si `export` es false, retornamos los datos filtrados como siempre
    return this.http.post<GetCreditDto[]>(`${environment.apiUrl}/credits/list_filters/`, params );
  }

  private exportExcel(params: HttpParams): void {
    this.http
      .post(`${environment.apiUrl}/credits/list_filters/`, params, {
        params: params,
        responseType: 'blob' // Se espera un archivo binario en formato blob
      })
      .subscribe((response: Blob) => {
        // Crear un enlace para descargar el archivo Excel
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'creditos_export.xlsx'; // Nombre del archivo Excel
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }


  
}
