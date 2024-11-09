import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { CreditService } from 'src/app/services/credits/credit.service';
import { NotificationService } from 'src/app/services/notifications/notification.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'notifications-credit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent  implements OnInit {
  notificacionesForm: FormGroup;
  estadosCredito = ['Aprobado', 'Rechazado', 'En proceso']; // Opciones del select
  filteredClients: Observable<any[]> = of([]);
  
  dataSource = new MatTableDataSource<GetCreditDto>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'client', 'interest_value',  'total_debt', 'remaining_balance', 'next_payment_date', 'loan_status'];
  selection = new SelectionModel<GetCreditDto>(true, []);


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private creditService: CreditService,
    private snackBar: ToastrService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {
    this.notificacionesForm = this.fb.group({
      client: [],
      clientSearch: [''],
      load_status: [''],
      sede: [this.authService.getSedeUser(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.filteredClients = this.notificacionesForm.get('clientSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {
          return this.clientService.getClients(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          this.notificacionesForm.get('client')?.setValue(null);
          this.filterCredits();
          return of([]);
        }
      })
    ) ?? of([]);
    this.loadCredits();
  }

  loadCredits(): void {
    this.creditService.getCredits(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: GetCreditDto[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator; // Asignar el paginador
      },
      error => {
        console.error('Error al cargar créditos', error);
      }
    );
  }

  filterCredits(){
    const filters = {
      sede: this.notificacionesForm.get('sede')?.value,
      client: this.notificacionesForm.get('client')?.value,
      load_status: this.notificacionesForm.get('load_status')?.value,
    };

    this.creditService.filterCredits(filters)?.subscribe(
      (credits) => {
          this.dataSource.data = credits;
          this.snackBar.success('Créditos filtrados correctamente', 'Éxito');

      },
      (error) => {
        this.snackBar.error(error.error.error, 'Error');
        console.error(error);
      }
    );
  }

  getSelectedCreditIds(): number[] {
    return this.selection.selected.map(credit => credit.id);
  }

  /** Llama al servicio para enviar notificaciones a los créditos seleccionados */
  sendNotificationSelectedCredits() {

    const selectedCreditIds = this.getSelectedCreditIds();
    if (selectedCreditIds.length > 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '350px',
        data: { message : `¿Está seguro que desea enviar  ${selectedCreditIds.length} notificaciones ?` }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.notificationService.sendNotification(selectedCreditIds).subscribe(
            response => {
              this.snackBar.success('Los mensajes se han enviado correctamente');
              this.selection.clear();
            },
            error => {
              this.snackBar.error(error.error.error);
            }
          );
        }
      });



    } else {
      this.snackBar.info('Debe seleccionar uno o varios créditos para notificar.');
    }
  }


//Filters
  displayClient(client: any): string {
    return client ? `${client.first_name} ${client.last_name} - ${client.type_document} ${client.document_number}` : '';
  }
  onClientSelected(client: any): void {
    this.notificacionesForm.get('client')?.setValue(client.id);
    this.filterCredits();
  }



  /** Si el número de filas seleccionadas coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, limpia la selección. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** El checkbox en la fila pasa a la selección */
  checkboxLabel(row?: GetCreditDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

}