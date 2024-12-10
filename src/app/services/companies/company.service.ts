import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyDto, CompanyResponse } from 'src/app/interfaces/company.interface';
import { UserResponse } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {}

    /**
   * Obtiene la información de las empresas.
   * @returns Observable con la lista de empresas.
   */
    getCompanies(): Observable<CompanyDto[]> {
      return this.http.get<CompanyDto[]>(`${environment.apiUrl}/company/`);

    }

      /**
   * Crea una nueva compañía.
   * @param companyData - Datos de la compañía que se desea crear.
   * @returns Observable con la respuesta del servidor.
   */
  createCompany(companyData: Omit<CompanyDto, 'id' | 'status'>): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(`${environment.apiUrl}/company/`, companyData);
  }

  updateCompany(companyId: number, companyData: Omit<CompanyDto, 'id' | 'status'>): Observable<CompanyDto> {
    return this.http.put<CompanyDto>(`${environment.apiUrl}/company/${companyId}/`, companyData);
  }

  deleteCompanyById(userId: number): Observable<CompanyResponse> {
    const url = `${environment.apiUrl}/company/${userId}/`;
    return this.http.delete<CompanyResponse>(url);
  }
}
