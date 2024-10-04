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
import { NewCodebtorFormComponent } from '../new-codebtor-form/new-codebtor-form.component';
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
    private snackBar: ToastrService,
    private authService: AuthService
  ) { }

  ngAfterViewInit(): void {
    this.coDebtorsDatasource.paginator = this.paginator;
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.getCoDebtors();
      });
    this.getCoDebtors();
  }

  getCoDebtors(): void {
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
    this.getCoDebtors(); 
  }


  openNewCodebtorDialog(): void {
    const dialogRef = this.dialog.open(NewCodebtorFormComponent, {
      width: '800px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

            this.coDebtorService.createCoDebtor(result).subscribe(
              resp => {
                this.snackBar.success('El codeudor ha sido creado satisfactoriamente.');
                this.getCoDebtors();
              },
              error => {
                console.error(error);
                this.snackBar.error('Hubo un error al crear el codeudor.');
              }
            );
   
      }
    });
  }


  editCodebtor(client: any): void {
    const dialogRef = this.dialog.open(NewCodebtorFormComponent, {
      width: '750px',
      data: { client, isEditMode: true },  
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coDebtorService.updateCoDebtor(client.id, result).subscribe(resp => {
          this.snackBar.success('Cambios efectuados exitosamente.');
          this.getCoDebtors();  
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
  deleteCodebtor(client: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar este codeudor: ${client.first_name.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coDebtorService.deleteClientById(client.id).subscribe((resp:any) => {
          this.snackBar.success(resp.message);
          this.getCoDebtors(); 
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
      this.coDebtorService.downloadCodebtorReport(sede);
    } else {
      console.error('Invalid sede value');
    }
  }
}
