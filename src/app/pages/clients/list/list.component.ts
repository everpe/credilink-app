import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientService } from 'src/app/services/clients/client.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIconModule ,
    MatMenuModule ,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  clientsDatasource = new MatTableDataSource<any>();
  offset = 1;
  limit = 10;
  sede = 1;
  search = 'otro';
  totalClients = 0;

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'type_document',
    'document_number',
    'city',
    'mobile',
    'status',
    'actions' 
  ];
  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }

  // Método para obtener los clientes con paginación
  getClients(): void {
    this.clientService.getClients(this.offset, this.limit, this.sede, this.search).subscribe(
      response => {
        this.clientsDatasource.data = response.results;  // Ajusta según el formato de la respuesta
        this.clientsDatasource.paginator = this.paginator;  // Vincula el paginador a los datos
        this.totalClients = response.count;
        this.clientsDatasource.sort = this.sort;  // Vincula el ordenamiento
        console.log(response.count);
      },
      error => {
        console.error('Error al obtener los clientes:', error);
      }
    );
  }

  // Método para manejar cambios en la paginación
  onPageChange(event: PageEvent): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.getClients();  // Vuelve a llamar al servicio para obtener nuevos datos
  }

  editClient(client: any): void {
    console.log('Editar cliente:', client);
    // Aquí va la lógica para editar el cliente
  }

  // Método para eliminar cliente
  deleteClient(client: any): void {
    console.log('Eliminar cliente:', client);
    // Aquí va la lógica para eliminar el cliente
  }
}
