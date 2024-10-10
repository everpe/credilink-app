export interface CreditDto {
    client: number;          // ID del cliente
    co_debtor: number;       // ID del codeudor
    loan_date: string;       // Fecha del préstamo o crédito
    reminder_date: string;   // Fecha de recordatorio
    loan_amount: number;     // Valor del préstamo o crédito
    interest_rate: number;   // Porcentaje de interés
    number_of_installments: number; // Número de cuotas
    sede: number;            // ID de la sede
    by_quota: boolean;    
}