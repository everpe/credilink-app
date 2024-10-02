import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { NewCoDebtorFormComponent } from '../new-co-debtor-form/new-co-debtor-form.component';

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
export class ListComponent {
  offset = 0;
  limit = 10;
  sede = 1;
  search = new FormControl('');
  totalRecords = 0;

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
  coDebtorsDatasource = new MatTableDataSource<any>();

  constructor(
    private coDebtorService: CodebtorService,
    private dialog: MatDialog,
    private snackBar: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.coDebtorsDatasource.paginator = this.paginator;
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.getClients();
      });
    this.getClients();
  }

  getClients(): void {
    this.coDebtorService.getCoDebtors(this.offset, this.limit, this.sede, this.search.value?.trim().toLowerCase() ?? '').subscribe(
      (response) => {
        this.coDebtorsDatasource.data = response.results;  
        this.totalRecords = response.count;  
      },
      (error) => {
        console.error('Error al obtener los codeudores:', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.limit = event.pageSize;
    this.getClients(); 
  }


  openNewClientDialog(): void {
    const dialogRef = this.dialog.open(NewCoDebtorFormComponent, {
      width: '800px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

            this.coDebtorService.createCoDebtor(result).subscribe(
              resp => {
                this.snackBar.success('El codeudor ha sido creado satisfactoriamente.');
                this.getClients();
              },
              error => {
                console.error(error);
                this.snackBar.error('Hubo un error al crear el codeudor.');
              }
            );
   
      }
    });
  }


  editClient(client: any): void {
    const dialogRef = this.dialog.open(NewCoDebtorFormComponent, {
      width: '750px',
      data: { client, isEditMode: true },  
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coDebtorService.updateCoDebtor(client.id, result).subscribe(resp => {
          this.snackBar.success('Cambios efectuados exitosamente.');
          this.getClients();  
        }, error => {
          this.snackBar.error('Ocurrió un error al actualizar el codeudor.');
          console.error(error);
        });
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  // Método para eliminar cliente
  deleteClient(client: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar este codeudor: ${client.first_name.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coDebtorService.deleteClientById(client.id).subscribe(resp => {
          this.snackBar.success('Este codeudor ha sido desactivado exitosamente.');
          this.getClients(); 
        }, error => {
          this.snackBar.error('Ocurrió un error al actualizar el cliente.');
          console.error(error);
        });;
      }
    });
  }
}
