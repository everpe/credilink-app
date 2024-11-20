import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { PaymentDataDto } from 'src/app/interfaces/payment.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payments/payment.service';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

@Component({
  selector: 'app-create-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatError,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule
  ],
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.scss'
})
export class CreatePaymentComponent {

  paymentForm: FormGroup;
  formattedAmountPayCapital: string = '';
  formattedAmountPayInteres: string = '';



  interestTotal: number = 0;
  capitalTotal: number = 0;
  totalAmount: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreatePaymentComponent>,
    private creditPaymentService: PaymentService,
    private toastr: ToastrService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public dataCredit: any // Puedes pasar datos adicionales si es necesario
  ) {
    this.paymentForm = this.formBuilder.group({
      credit: [this.dataCredit.clienteId, Validators.required],
      payment_date: [new Date()],
      description: [''],
      interest_amount: [''], // Campo opcional para monto de intereses
      interest_payment_method: [''], // Método opcional para intereses
      capital_amount: [''], // Campo opcional para monto de capital
      capital_payment_method: [''], // Método opcional para capital
      includeLateInterest: [false],
      sede: [this.authService.getSedeUser(), Validators.required],
    },
    {
      validators: [this.paymentMethodValidator], // Añadimos la validación personalizada
    });
    this.paymentForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.interestTotal = this.paymentForm.get('interest_amount')?.value || 0;
    this.capitalTotal = this.paymentForm.get('capital_amount')?.value || 0;
    this.totalAmount = this.interestTotal + this.capitalTotal;
  }



  // Método para validar si al menos uno de los pagos (interés o capital) es válido
  validateAtLeastOnePayment(): boolean {
    const interestAmount = this.paymentForm.get('interest_amount')?.value;
    const capitalAmount = this.paymentForm.get('capital_amount')?.value;

    return interestAmount > 0 || capitalAmount > 0;
  }


  formatDate = (date: any): string => {
    if (date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2); // Asegurarse de que el mes tenga dos dígitos
      const day = ('0' + d.getDate()).slice(-2); // Asegurarse de que el día tenga dos dígitos
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.paymentForm.invalid || !this.validateAtLeastOnePayment()) {
      this.toastr.error('Debe ingresar al menos un abono válido (capital o interés)', 'Error');
      return;
    }

    const payments = [];

    // Si hay un pago a interés, se agrega al array de pagos
    if (this.paymentForm.get('interest_amount')?.value > 0) {
      payments.push({
        type: 'interes',
        amount: this.paymentForm.get('interest_amount')?.value,
        payment_method: this.paymentForm.get('interest_payment_method')?.value,
      });
    }

    // Si hay un pago a capital, se agrega al array de pagos
    if (this.paymentForm.get('capital_amount')?.value > 0) {
      payments.push({
        type: 'capital',
        amount: this.paymentForm.get('capital_amount')?.value,
        payment_method: this.paymentForm.get('capital_payment_method')?.value,
      });
    }



 
    const paymentData: PaymentDataDto = {
      credit: this.paymentForm.get('credit')?.value,
      description: this.paymentForm.get('description')?.value,
      sede: this.paymentForm.get('sede')?.value,
      payment_date: this.formatDate(this.paymentForm.get('payment_date')?.value),//this.formatDate(this.paymentForm.get('payment_date')?.value),
      payments: payments,
    };

    this.creditPaymentService.createPayment(paymentData).subscribe(
      (response) => {
        this.toastr.success(response.message, 'Éxito');
        this.dialogRef.close(true); // Cierra el modal y pasa true como confirmación
      },
      (error) => {
        this.toastr.error(error.error.error, 'Error');
        console.error(error);
      }
    );
  }

  paymentMethodValidator(group: FormGroup): { [key: string]: any } | null {
    const interestAmount = group.get('interest_amount')?.value;
    const interestPaymentMethod = group.get('interest_payment_method')?.value;

    const capitalAmount = group.get('capital_amount')?.value;
    const capitalPaymentMethod = group.get('capital_payment_method')?.value;

    let error = null;

    // Si hay monto en interés pero no hay método de pago
    if (interestAmount > 0 && !interestPaymentMethod) {
      error = { interestMethodRequired: true };
    }

    // Si hay monto en capital pero no hay método de pago
    if (capitalAmount > 0 && !capitalPaymentMethod) {
      error = { ...error, capitalMethodRequired: true };
    }

    return error;
  }


  onAmountPayCapitalInput(event: any): void {
    const input = event.target.value.replace(/,/g, ''); // Remover comas para obtener el valor real
    const numericValue = parseFloat(input) || 0;

    // Actualiza el valor formateado con comas
    this.formattedAmountPayCapital = this.formatNumberWithCommas(numericValue);

    // Actualiza el valor del formulario sin las comas
    this.paymentForm.patchValue({ capital_amount: numericValue });

  }
  formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US'); // Formatear en inglés para separar con comas
  }

  onAmountPayInteresInput(event: any): void {
    const input = event.target.value.replace(/,/g, ''); // Remover comas para obtener el valor real
    const numericValue = parseFloat(input) || 0;

    // Actualiza el valor formateado con comas
    this.formattedAmountPayInteres = this.formatNumberWithCommas(numericValue);

    // Actualiza el valor del formulario sin las comas
    this.paymentForm.patchValue({ interest_amount: numericValue });

  }

  
  handleKeyPress(event: KeyboardEvent): void {
    KeyPressOnlyNumbersValidator(event);
  }
}
