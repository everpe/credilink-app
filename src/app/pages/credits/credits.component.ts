import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { CoDebtor } from 'src/app/interfaces/co-debtor';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { CreditService } from 'src/app/services/credits/credit.service';
import { ListComponent } from "./list/list.component";
import { SharedService } from 'src/app/services/shared/shared.service';
import { NotificationsComponent } from "./notifications/notifications.component";

@Component({
  selector: 'app-credits',
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
    ListComponent,
    NotificationsComponent
],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent implements OnInit {
  creditForm!: FormGroup;
  filteredClients: Observable<any[]> = of([]);  // Simulación de clientes filtrados
  filteredCoDebtors: Observable<CoDebtor[]> = of([]);
  monthlyInterest: number = 0; // Valor para mostrar el interés mensual
  formattedLoanAmount: string = '';

  constructor(private formBuilder: FormBuilder,
    private clientService: ClientService,
    private codebtorService: CodebtorService,
    private authService: AuthService,
    private creditService: CreditService,
    private snackBar: ToastrService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.creditForm = this.formBuilder.group({
      client: ['', Validators.required],
      clientSearch: ['', Validators.required],
      co_debtor: ['', Validators.required],
      coDebtorSearch: ['', Validators.required],
      loan_date: [new Date(), Validators.required],
      reminder_date: ['', Validators.required],
      loan_amount: [0, Validators.required],
      interest_rate: ['', [Validators.required, Validators.pattern(/^[0-9]+([.,][0-9]{1,2})?$/)]],
      number_of_installments: [0, Validators.required],
      sede: [this.authService.getSedeUser(), Validators.required],
      by_quota: [false, Validators.required],
      pin: ['', Validators.required] 
    });

    // Si no es por cuotas, el número de cuotas será 0
    this.onByQuotaChange();

    this.filteredClients = this.creditForm.get('clientSearch')?.valueChanges.pipe(
      debounceTime(300), // Espera a que el usuario deje de escribir
      switchMap(value => this.clientService.getClients(0, 20, 1, value).pipe(
        map(response => response?.results || []) // Aquí mapeamos solo los 'results', asegurándonos de que no sea undefined
      ))
    ) ?? of([]); // Si 'valueChanges' es undefined, asignamos un observable vacío
    this.filteredCoDebtors = this.creditForm.get('coDebtorSearch')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.codebtorService.getCoDebtors(0, 20, 1, value).pipe(
        map(response => response?.results || [])
      ))
    ) ?? of([]);

  }

  onSubmit() {
    if (this.creditForm.valid) {

      const pin = this.creditForm.get('pin')?.value;
      this.creditService.validatePinUser(pin).subscribe(
        response => {
          if(response){
            const formValue = { ...this.creditForm.value };

            // Eliminamos las propiedades extra que no necesitamos enviar
            delete formValue.clientSearch;
            delete formValue.coDebtorSearch;
            delete formValue.pin;
      
            // Función que formatea las fechas al formato 'YYYY-MM-DD'para el server format
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
      
            // Convertimos las fechas al formato 'YYYY-MM-DD'
            if (formValue.loan_date) {
              formValue.loan_date = formatDate(formValue.loan_date); // Convertimos la fecha del préstamo
            }
            if (formValue.reminder_date) {
              formValue.reminder_date = formatDate(formValue.reminder_date); // Convertimos la fecha de recordatorio
            }
            formValue.interest_rate = Number(formValue.interest_rate?.replace(',','.'))
            this.creditService.createCredit(formValue).subscribe(
              response => {
                this.snackBar.success(response.message);
                this.creditForm.reset(
                  {
                    client: '',
                    clientSearch: '',
                    co_debtor: '', 
                    coDebtorSearch: '',
                    loan_date: new Date(), 
                    reminder_date: '', 
                    loan_amount: 0,
                    interest_rate: '',
                    number_of_installments: 0,
                    sede: this.authService.getSedeUser(),
                    by_quota: false,
                  }
                );
                this.formattedLoanAmount = ""; 
                this.monthlyInterest = 0;
                Object.keys(this.creditForm.controls).forEach(key => {
                  this.creditForm.get(key)?.setErrors(null); // Limpia los errores de validación
                  this.creditForm.get(key)?.markAsPristine(); // Marca el control como limpio
                  this.creditForm.get(key)?.markAsUntouched(); // Marca el control como no tocado
                });
                this.sharedService.triggerReloadCredits();
              },
              error => {
                this.snackBar.error(error.error.error);
              }
            );
          }
        }, error =>{
          this.snackBar.error(error.error.error);
        }
      );


  
    }
  }


  onClientSelected(client: any): void {
    this.creditForm.patchValue({ client: client.id }); // Asigna el ID del cliente al formulario
  }
  onCoDebtorSelected(coDebtor: any): void {
    this.creditForm.patchValue({ co_debtor: coDebtor.id }); // Asigna el ID del codeudor al formulario
  }
  // Define cómo mostrar el cliente en el campo de entrada
  displayClient(client: any): string {
    return client ? `${client.first_name} ${client.last_name} - ${client.type_document} ${client.document_number}` : '';
  }
  displayCoDebtor(coDebtor: any): string {
    return coDebtor ? `${coDebtor.first_name} ${coDebtor.last_name} - ${coDebtor.type_document} ${coDebtor.document_number}` : '';
  }


  // Método que se ejecuta cuando cambia la opción "Por cuotas"
  onByQuotaChange(): void {
    if (this.creditForm.get('by_quota')?.value === false) {
      this.creditForm.patchValue({ number_of_installments: 0 });
    }
  }

  // Método para calcular el interés mensual
  calculateInterest(): void {
    const loanAmount = this.creditForm.get('loan_amount')?.value || 0;
    const interestRate = Number(this.creditForm.get('interest_rate')?.value?.replace(',','.')) || 0;

    // Calcular el interés mensual
    this.monthlyInterest = (loanAmount * (interestRate / 100)) || 0;
  }



  onLoanAmountInput(event: any): void {
    const input = event.target.value.replace(/,/g, ''); // Remover comas para obtener el valor real
    const numericValue = parseFloat(input) || 0;

    // Actualiza el valor formateado con comas
    this.formattedLoanAmount = this.formatNumberWithCommas(numericValue);

    // Actualiza el valor del formulario sin las comas
    this.creditForm.patchValue({ loan_amount: numericValue });

    // Recalcular el interés después de cambiar el valor del préstamo
    this.calculateInterest();
  }
  formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US'); // Formatear en inglés para separar con comas
  }
  // Método para restringir la entrada a solo números y el punto decimal


  restrictToNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const key = event.key;
  
    if (
      allowedKeys.includes(key) ||
      (key >= '0' && key <= '9') 
      // (key === '.' && event.target && !(event.target as HTMLInputElement).value.includes('.'))
    ) {
      return;
    } else {
      event.preventDefault();
    }
  }
  
}
