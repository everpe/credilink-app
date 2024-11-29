import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { CoDebtorDto } from 'src/app/interfaces/co-debtor';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { CreditService } from 'src/app/services/credits/credit.service';
import { atLeastOneFieldValidator } from 'src/app/shared/Validators/filterCredito-validator';
import { DetailCreditComponent } from '../detail-credit/detail-credit.component';
import { CreatePaymentComponent } from '../../payments/create-payment/create-payment.component';
import { PaymentsCreditListComponent } from '../../payments/payments-credit-list/payments-credit-list.component';
import { SharedService } from 'src/app/services/shared/shared.service';
import { HistoryPaymentsComponent } from '../../payments/history-payments/history-payments.component';
import { UpdateCreditComponent } from '../update-credit/update-credit.component';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { JobRelationship, TypeLinkage } from 'src/app/interfaces/client.interface';

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
export class ListComponent implements OnInit {

  displayedColumns: string[] = [
    'actions',
    'client', 
    'co_debtors',
    'job_relationship',
    'loan_date',
    'loan_amount', 
    'loan_status', 
    'interest_value', 
    'total_debt', 
    'remaining_balance', 
    'next_payment_date',

  ];
  dataSource = new MatTableDataSource<GetCreditDto>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  requestForm: FormGroup;
  filteredClients: Observable<any[]> = of([]);
  filteredCoDebtors: Observable<CoDebtorDto[]> = of([]);
  lisTypeLinkages: TypeLinkage[] = [];
  lisJobRelationShips: JobRelationship[] = [];

  private reloadSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder,
    private codebtorService: CodebtorService,
    private authService: AuthService,
    private clientService: ClientService,
    private creditService: CreditService,
    private snackBar: ToastrService,
    private dialog: MatDialog,
    private sharedService: SharedService
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
      type_linkage: [''],
      job_relationship: [''],
      sede: [this.authService.getSedeUser(), Validators.required],
    }, {
      validators: atLeastOneFieldValidator([
        'client',
        'co_debtor', 
        'load_status', 
        'export', 
        'dateRange.start', 
        'dateRange.end',
        'job_relationship',
        'type_linkage'
      ])  // Aplicar el validador
    });
  }



  ngOnInit(): void {
    this.reloadSubscription = this.sharedService.reloadCredits$.subscribe((shouldReload) => {
      if (shouldReload) {
        this.loadCredits(); // Vuelve a cargar la lista de créditos
      }
    });

    this.loadCredits();
    this.subscribeToSearchFields();

    this.getAllTypeLinkages();
    this.GetAllJobRelationships();
  }

  credits: GetCreditDto[] = [];

  getAllTypeLinkages(){
    this.clientService.getTypesLinkages(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: TypeLinkage[]) => {
        this.lisTypeLinkages = data;
      },
      (error) => {
        console.error('Error fetching type_lynkages:', error);
      }
    );
  }
  GetAllJobRelationships(){
    this.clientService.getJobRelationships(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: JobRelationship[]) => {
        this.lisJobRelationShips = data;
      },
      (error) => {
        console.error('Error fetching job relationships:', error);
      }
    );

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


  applyFilters() {
    if (this.requestForm.invalid) {
      this.snackBar.warning('Debe seleccionar por lo menos un filtro.', 'Advertencia');
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

      export: this.requestForm.get('export')?.value,
      job_relationship: this.requestForm.get('job_relationship')?.value,
      type_linkage: this.requestForm.get('type_linkage')?.value
    };

    this.creditService.filterCredits(filters)?.subscribe(
      (credits) => {
        if (!filters.export) {
          this.dataSource.data = credits;
          this.snackBar.success('Créditos filtrados obtenidos correctamente', 'Éxito');
        } else {
          // Si `export` es true, ya se habrá manejado la descarga en el servicio
          this.snackBar.success('Exportación en proceso', 'Éxito');
        }
      },
      (error) => {
        this.snackBar.error(error.error.error, 'Error');
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
        if (value) {
          return this.clientService.getClients(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          this.requestForm.get('client')?.setValue(null);
          return of([]);
        }
      })
    ) ?? of([]);

    this.filteredCoDebtors = this.requestForm.get('coDebtorSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {
          return this.codebtorService.getCoDebtors(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          this.requestForm.get('co_debtor')?.setValue(null);
          return of([]);
        }
      })
    ) ?? of([]);
  }

  displayClient(client: any): string {
    return client ? `${client.first_name} ${client.last_name} - ${client.type_document} ${client.document_number}` : '';
  }
  onClientSelected(client: any): void {
    this.requestForm.get('client')?.setValue(client.id);
  }
  onCoDebtorSelected(coDebtor: any): void {
    this.requestForm.get('co_debtor')?.setValue(coDebtor.id);
  }
  displayCoDebtor(coDebtor: any): string {
    return coDebtor ? `${coDebtor.first_name} ${coDebtor.last_name} - ${coDebtor.type_document} ${coDebtor.document_number}` : '';
  }

  viewDetailCredit(credit: GetCreditDto){
    this.dialog.open(DetailCreditComponent, {
      data: credit,
      width: '600px',
      disableClose: true
    });
  }


  openListPayments(credito: GetCreditDto){
    const dialogRef = this.dialog.open(HistoryPaymentsComponent, {
      width: '1000px', 
      data: { credit: credito }, 
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.loadCredits();
    });
  }


  openUpdateCreditModal(creditData: any): void {
    const dialogRef = this.dialog.open(UpdateCreditComponent, {
      width: '600px',
      data: creditData,
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCredits();
      }
    });
  }

  deleteCredit(credit: GetCreditDto){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar el credito de ${credit.client.first_name} ${credit.client.last_name}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creditService.deleteCreditById(credit.id).subscribe(
          (resp: any) => {
            this.snackBar.success(resp.message);
            this.loadCredits(); 
        }, 
          error => {
            this.snackBar.error(error.error.error);
            console.error(error);
        });;
      }
    });

  }
}


export interface CreditFilter {
  load_status: string;
  created_at_after: Date;
  created_at_before: Date;
}