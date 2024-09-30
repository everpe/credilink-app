import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientService } from 'src/app/services/clients/client.service';
import { NewClientFormComponent } from '../new-client-form/new-client-form.component';

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
export class ListComponent implements AfterViewInit {
  offset = 0;
  limit = 10;
  sede = 1;
  search = 'otro';
  totalClients = 0;
  
  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'job_relationship',
    'document_number',
    'created_at',
    'created_by',
    'status',
    'actions' 
  ];
  
  private paginator!: MatPaginator;
  clientsDatasource = new MatTableDataSource<any>();

  constructor(private clientService: ClientService, private dialog: MatDialog) {
    }

  ngAfterViewInit(): void {
    this.clientsDatasource.paginator = this.paginator;
    this.getClients();
  }

  // Método para obtener los clientes con paginación
  getClients(): void {
    this.clientService.getClients(this.offset, this.limit, this.sede, this.search).subscribe(
      (response) => {
        this.clientsDatasource.data = response.results;  // Asigna los datos obtenidos de la API
        this.totalClients = response.count;  // Actualiza el número total de clientes
      },
      (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    );
  }
  

  onPageChange(event: PageEvent): void {
    this.offset = ((event.pageIndex + 1) - 1) * event.pageSize;// event.pageIndex * event.pageSize;
    // console.log('pageIndex;' + event.pageIndex)
    // console.log('pageSize;' + event.pageSize)
    // console.log('offset;' + this.offset)
    this.limit = event.pageSize;
    this.getClients();  // Vuelve a llamar al servicio para obtener nuevos datos
  }


  openNewClientDialog(): void {
    const dialogRef = this.dialog.open(NewClientFormComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getClients();  // Actualiza la lista de clientes después de registrar uno nuevo
      }
    });
  }

  editClient(client: any): void {
    console.log('Editar cliente:', client);
  }

  // Método para eliminar cliente
  deleteClient(client: any): void {
    console.log('Eliminar cliente:', client);
  }
}
