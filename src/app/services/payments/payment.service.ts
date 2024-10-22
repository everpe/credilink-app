import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDataDto, PaymentDto } from 'src/app/interfaces/payment.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {}



  createPayment(paymentData: PaymentDataDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${environment.apiUrl}/payments/`, paymentData, { headers });
  }

  getCreditPayments(creditId: number): Observable<PaymentDto[]> {


    return this.http.get<PaymentDto[]>(`${environment.apiUrl}/credits/${creditId}/get_payments/`);
  }
}
