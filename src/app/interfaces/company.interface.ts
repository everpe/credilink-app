export interface CompanyDto {
    id: number;
    social_reason: string;
    rut: string;
    fiscal_address: string;
    representative_first_name: string;
    representative_last_name: string;
    type_document: string;
    document_number: string;
    business_phone: string;
    cellphone: string;
    email: string;
    number_of_locations: number;
    company_name: string;
    status: boolean;
  }
  
  export interface CompanyResponse {
    message: string; 
  }