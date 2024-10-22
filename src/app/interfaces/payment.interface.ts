export interface PaymentDto {
    type: string; // El tipo de pago, por ejemplo, 'interes' o 'CAPITAL'
    amount: number; // El monto del pago
    payment_method: string; // El método de pago, por ejemplo, 'Efectivo', 'Transferencia', 'Tarjeta'
  }
  
  export interface PaymentDataDto {
    credit: number; // El ID del crédito al que se aplica el abono
    payments: PaymentDto[]; // Array de pagos realizados
    description: string; // Descripción del abono
    sede: number; // ID de la sede donde se realiza el abono
  }
  