import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSedeDto, SedeDto } from 'src/app/interfaces/sede.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  constructor(private http: HttpClient) { }


  /**
   * Obtiene todas las sedes.
   * @returns Observable con la lista de sedes.
   */
  getSedes(): Observable<SedeDto[]> {
    return this.http.get<SedeDto[]>(`${environment.apiUrl}/sede/`);
  }


  createSede(sedeData: CreateSedeDto): Observable<SedeDto> {
    return this.http.post<SedeDto>(`${environment.apiUrl}/sede/`, sedeData);
  }

    /**
   * Actualiza una sede existente.
   * @param sedeId - ID de la sede a actualizar.
   * @param sedeData - Datos de la sede actualizados.
   * @returns Observable con la respuesta del servidor.
   */
    updateSede(sedeId: number, sedeData: CreateSedeDto): Observable<SedeDto> {
      return this.http.put<SedeDto>(`${environment.apiUrl}/sede/${sedeId}/`, sedeData);
    }

    /**
   * Elimina una sede por su ID.
   * @param sedeId - ID de la sede a eliminar.
   * @returns Observable con el mensaje de confirmación del servidor.
   */
    deleteSede(sedeId: number): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`${environment.apiUrl}/sede/${sedeId}/`);
    }
}
