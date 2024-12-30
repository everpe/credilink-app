import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { PaymentDto, UpdatePaymentDto } from 'src/app/interfaces/payment.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payments/payment.service';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

@Component({
  selector: 'app-update-payment',
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
    MatDatepickerModule
  ],
  templateUrl: './update-payment.component.html',
  styleUrl: './update-payment.component.scss'
})
export class UpdatePaymentComponent {
  paymentForm: FormGroup;
  paymentTypes: string[] = ['Efectivo', 'Transferencia', 'Tarjeta']; // Opciones de tipos de pago
  formattedAmountPay: string = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<UpdatePaymentComponent>,
    private snackBar: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
  ) {

    this.paymentForm = this.fb.group({
      id: [this.data.payment.id],
      payment_date: [
        this.convertStringToDate(this.data.payment.paymentDate),
        // this.convertToDate(this.data.payment.paymentDate),
        [Validators.required]
      ], // Fecha del pago
      sede: [this.authService.getSedeUser(), [Validators.required]], // ID de la sede
      credit: [this.data.payment.credit, [Validators.required]], // ID del crédito
      amount: [this.data.payment.amount, [Validators.required, Validators.min(1)]], // Monto
      payment_type: [this.data.payment.paymentType, [Validators.required]], // Tipo de pago
    });
    this.formattedAmountPay = this.formatNumberWithCommas(parseFloat(this.data.payment.amount) || 0)
  }


  convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number); // Divide y convierte a números
    return new Date(year, month - 1, day); // JavaScript usa meses de 0 a 11
  }

  onSubmit(): void {
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

    if (this.paymentForm.valid) {
      let paymentData: UpdatePaymentDto = this.paymentForm.value;
      paymentData.payment_date = formatDate(paymentData.payment_date);
      paymentData.amount = parseFloat(this.paymentForm.value.amount);
      this.paymentService.updatePayment(paymentData.id, paymentData).subscribe({
        next: (response) => {
          this.snackBar.success(response.message);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar el pago:', err);
          this.snackBar.error(err.error.error);
        },
      });
    } else {
      this.snackBar.error('Complete todos los campos correctamente');
    }
  }


  handleKeyPress(event: KeyboardEvent): void {
    KeyPressOnlyNumbersValidator(event);
  }
  formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US'); // Formatear en inglés para separar con comas
  }

  onAmountPayCapitalInput(event: any): void {
    const input = event.target.value.replace(/,/g, '').replace(/[^\d.]/g, ''); // Eliminar comas y caracteres no numéricos
    const numericValue = parseFloat(input) || 0;
  
    // Actualiza el valor del formulario sin formatear
    this.paymentForm.patchValue({ amount: numericValue });
  
    // Actualiza el valor formateado con comas
    this.formattedAmountPay = this.formatNumberWithCommas(numericValue);
  }
  
}
