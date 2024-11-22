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


export interface GetCreditDto {
    id: number;
    by_quota: boolean;
    client: {
      id: number;
      first_name: string;
      last_name: string;
      document_number: string; // Assuming cedula/document is returned as document_number
      job_relationship: {
        id: number,
        name: string
      }
      type_linkage: {
        id: number,
        name: string
      }
    };
    co_debtor: {
      id: number;
      first_name: string;
      last_name: string;
      document_number: string;
      company: string;
      office_phone: string;
      phone: string;
      mobile: string;
      address: string;
    };
    loan_date: string;
    reminder_date: string;
    loan_amount: number;
    interest_rate: number;
    number_of_installments: number;
    load_status: string;
    interest_value: number;
    total_debt: number;
    remaining_balance: number;
    next_payment_date: string | null;
    current_interest_debt: number;
  }
  

  export interface ConcepCredit{
    concept: string
    amount: number
  }

  export interface UpdateCredit{
    loan_amount: number;
    loan_date: string;
    co_debtor: number;
    client: number;
    reminder_date: string;
    interest_rate: string;
  }