import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientService } from 'src/app/services/clients/client.service';
import { NewClientFormComponent } from '../new-client-form/new-client-form.component';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements AfterViewInit {
  offset = 0;
  limit = 10;
  sede = 1;
  search = new FormControl('');
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

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: ToastrService,
    private authService: AuthService
  ) { }

  ngAfterViewInit(): void {
    this.clientsDatasource.paginator = this.paginator;
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.getClients();
      });
    this.getClients();
  }

  // Método para obtener los clientes con paginación
  getClients(): void {
    this.clientService.getClients(this.offset, this.limit, this.sede, this.search.value?.trim().toLowerCase() ?? '').subscribe(
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
    this.limit = event.pageSize;
    this.getClients(); 
  }


  openNewClientDialog(): void {
    const dialogRef = this.dialog.open(NewClientFormComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

            this.clientService.createClient(result).subscribe(
              resp => {
                this.snackBar.success('El cliente ha sido creado satisfactoriamente.');
                this.getClients();
              },
              error => {
                console.error(error);
                this.snackBar.error('Hubo un error al crear el cliente.');
              }
            );
   
      }
    });
  }


  editClient(client: any): void {
    const dialogRef = this.dialog.open(NewClientFormComponent, {
      width: '750px',
      data: { client, isEditMode: true },  // Pasamos el cliente para editar
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.updateClient(client.id, result).subscribe(resp => {
          this.snackBar.success('Cambios efectuados exitosamente.');
          this.getClients();  // Refresca la lista de clientes
        }, error => {
          this.snackBar.error('Ocurrió un error al actualizar el cliente.');
          console.error(error);
        });
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  // Método para desactivar cliente
  deleteClient(client: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar este cliente: ${client.first_name.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClientById(client.id).subscribe(
          (resp: any) => {
            this.snackBar.success(resp.message);
            this.getClients(); 
        }, 
          error => {
            this.snackBar.error('Ocurrió un error al actualizar el cliente.');
            console.error(error);
        });;
      }
    });
  }

  downloadReport(): void {
    const sede = Number(this.authService.getSedeUser());
    if (!isNaN(sede)) {
      this.clientService.downloadClientReport(sede);
    } else {
      console.error('Invalid sede value');
    }
  }
}
