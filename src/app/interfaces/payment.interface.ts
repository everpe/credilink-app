export interface PaymentCreateDto {
    type: string; // El tipo de pago, por ejemplo, 'interes' o 'CAPITAL'
    amount: number; // El monto del pago
    payment_method: string; // El método de pago, por ejemplo, 'Efectivo', 'Transferencia', 'Tarjeta'
  }
  
  export interface PaymentDataDto {
    credit: number; // El ID del crédito al que se aplica el abono
    payments: PaymentCreateDto[]; // Array de pagos realizados
    description: string; // Descripción del abono
    sede: number; // ID de la sede donde se realiza el abono
    payment_date: string
  }
  

  export interface PaymentDto {
    id: number;
    type: string;
    paymentType: string;
    credit: number;
    amount: number;
    paymentDate: Date;
    interestPayment: number;
    capitalPayment: number;
    lateInterest: number;
    currentCapital: number;
    remainingCapital: number;
    currentInterest: number;
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