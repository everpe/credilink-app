export interface PaymentCreateDto {
    type: string; // El tipo de pago, por ejemplo, 'interes' o 'CAPITAL'
    amount: number; // El monto del pago
    payment_method: 'Efectivo' | 'Transferencia' | 'Tarjeta'; // El método de pago, por ejemplo, 'Efectivo', 'Transferencia', 'Tarjeta'
  }
  
  export interface PaymentDataDto {
    credit: number; // El ID del crédito al que se aplica el abono
    payments: PaymentCreateDto[]; // Array de pagos realizados
    description: string; // Descripción del abono
    sede: number; // ID de la sede donde se realiza el abono
    payment_date: string;
    skip_interest_check: boolean
  }
  

  export interface PaymentDto {
    id: number;
    type: string;
    paymentType: string;
    credit: number;
    amount: number;
    paymentDate: string;
    interestPayment: number;
    capitalPayment: number;
    lateInterest: number;
    currentCapital: number;
    remainingCapital: number;
    currentInterest: number;
  }


  export interface UpdatePaymentDto {
    id: number;
    payment_date: string;  // Fecha del pago en formato YYYY-MM-DD
    sede: number;          // ID de la sede donde se realiza el abono
    credit: number;        // ID del crédito al cual se aplica el abono
    amount: number;        // Monto del abono
    payment_type: 'Efectivo' | 'Transferencia' | 'Tarjeta'; // Tipo de pago permitido
  }


  // export interface PaymentDto {
  //   id: number;
  //   type: string;
  //   paymentType: string;
  //   credit: number;
  //   amount: number;
  //   paymentDate: Date;
  //   currentCapital: number;
  //   pendingCapital: number;
  //   currentInterest: number;
  // }