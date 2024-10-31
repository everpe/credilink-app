import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';
import { ClientService } from 'src/app/services/clients/client.service';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { CreditService } from 'src/app/services/credits/credit.service';

@Component({
  selector: 'app-update-credit',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './update-credit.component.html',
  styleUrl: './update-credit.component.scss'
})
export class UpdateCreditComponent implements OnInit{
  creditForm!: FormGroup;
  filteredClients: Observable<any[]> = of([]);
  filteredCoDebtors: Observable<any[]> = of([]);
  formattedLoanAmount: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateCreditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetCreditDto,
    private creditService: CreditService,
    private codebtorService: CodebtorService,
    private clientService: ClientService,
    private snackBar: ToastrService
  ) {}

  ngOnInit(): void {
    this.creditForm = this.formBuilder.group({
      client: [this.data.client || '', Validators.required],
      clientSearch: [this.data.client, Validators.required],
      co_debtor: [this.data.co_debtor || null, Validators.required], // Usa el objeto completo
      coDebtorSearch: [this.data.co_debtor || '', Validators.required], // Usa el objeto completo
      // loan_date: [this.data.loan_date || new Date(), Validators.required],
      loan_date: this.convertToLocalDate(this.data.loan_date),
      reminder_date: [this.data.reminder_date || '', Validators.required],
      loan_amount: [this.data.loan_amount || 0, Validators.required],
      interest_rate	:[this.data.interest_rate,],
      pin: ['', Validators.required] 
    });
  
    this.patchFormValues();
    this.setupCoDebtorSearch();
    this.setupClientSearch();
  }
  
  private patchFormValues(): void {
    if (this.creditForm && this.data) {
      this.creditForm.patchValue({
        client: this.data.client,
        co_debtor: this.data.co_debtor, // Pasa el objeto completo
        coDebtorSearch: this.data.co_debtor, // También usa el objeto completo
        loan_date: this.convertToLocalDate(this.data.loan_date),
        reminder_date: this.convertToLocalDate(this.data.reminder_date),
        loan_amount: this.data.loan_amount,
        interest_rate: this.data.interest_rate,
        pin: '' 

      });
      this.formattedLoanAmount = this.formatNumberWithCommas(parseFloat(this.data.loan_amount+""));
    }
  }
  
  private convertToLocalDate(dateString: string): Date {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }
  
  
  
  private setupCoDebtorSearch(): void {
    this.filteredCoDebtors = this.creditForm.get('coDebtorSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {
          return this.codebtorService.getCoDebtors(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          this.creditForm.get('co_debtor')?.setValue(null); // Resetea el valor de co_debtor si el campo está vacío
          return of([]);
        }
      })
    ) ?? of([]);
  }
  private setupClientSearch(): void {
    this.filteredClients = this.creditForm.get('clientSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value) {
          return this.clientService.getClients(0, 20, 1, value).pipe(
            map(response => response?.results || [])
          );
        } else {
          this.creditForm.get('client')?.setValue(null);
          return of([]);
        }
      })
    ) ?? of([]);
  }
  onClientSelected(client: any): void {
    this.creditForm.patchValue({ 
      client: client, // Pasa el objeto completo al campo de formulario
      clientSearch: client // También actualiza el campo de búsqueda
    });
  }
  // onCoDebtorSelected(coDebtor: any): void {
  //   this.creditForm.patchValue({ co_debtor: coDebtor.id }); // Asigna el ID del codeudor al formulario
  // }
  onCoDebtorSelected(coDebtor: any): void {
    this.creditForm.patchValue({ 
      co_debtor: coDebtor, // Pasa el objeto completo al campo de formulario
      coDebtorSearch: coDebtor // También actualiza el campo de búsqueda
    });
  }
  displayClient(client: any): string {
    return client ? `${client.first_name} ${client.last_name} - ${client.document_number}` : '';
  }
  displayCoDebtor(coDebtor: any): string {
    return coDebtor && coDebtor.first_name && coDebtor.last_name
      ? `${coDebtor.first_name} ${coDebtor.last_name} - ${coDebtor.document_number??0}`
      : 'Información no disponible';
  }
  
  updateCredit(): void {
    this.creditForm.markAllAsTouched();
    if (this.creditForm.valid) {

      const pin = this.creditForm.get('pin')?.value;
      this.creditService.validatePinUser(pin).subscribe(
        response => {
          if(response){
            const formatDate = (date: any): string => {
              if (date) {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = ('0' + (d.getMonth() + 1)).slice(-2); // Asegurarse de que el mes tenga dos dígitos
                const day = ('0' + d.getDate()).slice(-2); // Asegurarse de que el día tenga dos dígitos
                return `${year}-${month}-${day}`;
              }
              return "";
            };
            this.creditService.updateCredit(this.data.id, {
              loan_amount: this.creditForm.get('loan_amount')?.value ,
              loan_date:  formatDate(this.creditForm.get('loan_date')?.value) ,
              co_debtor: this.creditForm.get('co_debtor')?.value.id,
              client: this.creditForm.get('client')?.value.id,
              reminder_date: formatDate(this.creditForm.get('reminder_date')?.value), 
            }).subscribe(
              () => {
                this.snackBar.success('Crédito actualizado exitosamente');
                this.dialogRef.close(true);
              },
              (error) => {
                this.snackBar.error(error.error.error);
                console.error(error);
              }
            );

          }
        },error => {
          this.snackBar.error(error.error.error);
         }
      );


  
    }
  }


  onLoanAmountInput(event: any): void {
    const input = event.target.value.replace(/,/g, ''); // Remover comas para obtener el valor real
    const numericValue = parseFloat(input) || 0;

    // Actualiza el valor formateado con comas
    this.formattedLoanAmount = this.formatNumberWithCommas(numericValue);

    // Actualiza el valor del formulario sin las comas
    this.creditForm.patchValue({ loan_amount: numericValue });
  }
  formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US'); // Formatear en inglés para separar con comas
  }
}
