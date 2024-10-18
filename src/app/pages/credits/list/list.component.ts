import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, map, Observable, of, switchMap } from 'rxjs';
import { CoDebtor } from 'src/app/interfaces/co-debtor';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { CreditService } from 'src/app/services/credits/credit.service';
import { atLeastOneFieldValidator } from 'src/app/shared/Validators/filterCredito-validator';

@Component({
  selector: 'list-credits',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDividerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // Usar los formatos personalizados
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent  implements OnInit {

  displayedColumns: string[] = ['client', 'co_debtor', 'loan_date', 'reminder_date', 'loan_amount', 'interest_rate', 'number_of_installments', 'loan_status', 'interest_value', 'total_debt', 'remaining_balance', 'next_payment_date'];
  dataSource = new MatTableDataSource<GetCreditDto>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  requestForm: FormGroup;
  filteredClients: Observable<any[]> = of([]); 
  filteredCoDebtors: Observable<CoDebtor[]> = of([]);
  
  constructor(private formBuilder: FormBuilder,
    private clientService: ClientService,
    private codebtorService: CodebtorService,
    private authService: AuthService,
    private creditService: CreditService,
    private snackBar: ToastrService,
  ) { 
    this.requestForm = this.formBuilder.group({
      load_status: [''],
      dateRange: this.formBuilder.group({
        start: [''],
        end: [''],
      }),
      export: [false],
      client: [],
      clientSearch: [''],
      co_debtor: [],
      coDebtorSearch: [''],
      sede: [this.authService.getSedeUser(), Validators.required],
    },{
      validators: atLeastOneFieldValidator(['client', 'co_debtor', 'load_status','export', 'dateRange.start', 'dateRange.end'])  // Aplicar el validador
    });
  }



  ngOnInit(): void {
    this.loadCredits();
    this.subscribeToSearchFields();
  }

  credits: GetCreditDto[] = [];


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


  applyFilters() {
    if (this.requestForm.invalid) {
      this.snackBar.error('Debe seleccionar por lo menos un filtro.', 'Error');
      return;
    }

    const filters = {
      sede: this.requestForm.get('sede')?.value,
      client: this.requestForm.get('client')?.value,
      co_debtor: this.requestForm.get('co_debtor')?.value,
      load_status: this.requestForm.get('load_status')?.value,
      created_at_after: this.requestForm?.get('dateRange.start')?.value instanceof Date
      ? this.requestForm?.get('dateRange.start')?.value.toISOString().split('T')[0]
      : null,
    
    created_at_before: this.requestForm?.get('dateRange.end')?.value instanceof Date
      ? this.requestForm?.get('dateRange.end')?.value.toISOString().split('T')[0]
      : null,
  
    export: this.requestForm.get('export')?.value
    };

    this.creditService.filterCredits(filters)?.subscribe(
      (credits) => {
        if (!filters.export) {
          // Si `export` es false, manejar los datos de créditos recibidos
          this.dataSource.data = credits;
          this.snackBar.success('Créditos filtrados obtenidos correctamente', 'Éxito');
          console.log(credits); // Aquí puedes manejar los créditos filtrados
        } else {
          // Si `export` es true, ya se habrá manejado la descarga en el servicio
          this.snackBar.success('Exportación en proceso', 'Éxito');
        }
      },
      (error) => {
        this.snackBar.error('Hubo un error al filtrar los créditos', 'Error');
        console.error(error);
      }
    );
  }



  resetFilters() {
    this.requestForm.reset({
      load_status: '',
      dateRange: {
        start: '',
        end: ''
      },
      export: false,
      client: '',
      clientSearch: '',
      co_debtor: '',
      coDebtorSearch: '',
      sede: this.authService.getSedeUser()  // Ya no lo pones en un array
    });
  
    // Limpiar los observables de clientes y codeudores
    this.filteredClients = of([]); 
    this.filteredCoDebtors = of([]);
  
    // Volvemos a cargar los créditos sin filtros
    this.loadCredits();
  
    // Vuelve a inicializar la lógica de búsqueda
    this.subscribeToSearchFields();
  }
  
  subscribeToSearchFields() {
    this.filteredClients = this.requestForm.get('clientSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {  // Verificamos que no sea vacío
          return this.clientService.getClients(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          return of([]);  // Si está vacío, devolvemos un observable vacío
        }
      })
    ) ?? of([]);
  
    this.filteredCoDebtors = this.requestForm.get('coDebtorSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {  // Verificamos que no sea vacío
          return this.codebtorService.getCoDebtors(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          return of([]);  // Si está vacío, devolvemos un observable vacío
        }
      })
    ) ?? of([]);
  }
  
  displayClient(client: any): string {
    return client ? `${client.first_name} ${client.last_name} - ${client.type_document} ${client.document_number}` : '';
  }
  onClientSelected(client: any): void {
    this.requestForm.get('client')?.setValue( client.id ); // Asigna el ID del cliente al formulario
  }
  onCoDebtorSelected(coDebtor: any): void {
    this.requestForm.get('co_debtor')?.setValue(  coDebtor.id ); // Asigna el ID del codeudor al formulario
  }
  displayCoDebtor(coDebtor: any): string {
    return coDebtor ? `${coDebtor.first_name} ${coDebtor.last_name} - ${coDebtor.type_document} ${coDebtor.document_number}` : '';
  }
}


export interface CreditFilter {
  load_status: string;
  created_at_after: Date;
  created_at_before: Date;
}