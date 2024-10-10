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
}
