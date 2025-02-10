import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  sendNotification(creditsId: number[], reminder_type: string): Observable<any> {
    const body = { credits_id: creditsId, reminder_type };

    return this.http.post<any>(`${environment.apiUrl}/credits/send_notification/`, body);
  }
}
