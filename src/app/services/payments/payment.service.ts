import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDataDto, PaymentDto, UpdatePaymentDto } from 'src/app/interfaces/payment.interface';
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

    /**
   * Método para actualizar un abono
   * @param id ID del abono a editar
   * @param updatePaymentDto Datos actualizados del abono
   * @returns Observable con la respuesta de la API
   */
    updatePayment(id: number, updatePaymentDto: UpdatePaymentDto): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/payments/${id}/`, updatePaymentDto);
    }
}
