export interface CreateClientDto {
    first_name: string;
    last_name: string;
    type_document: string;
    document_number: string;
    place_of_issue: string;
    gender: Gender;
    phone: string;
    mobile: string;
    address: string;
    neighborhood: string;
    city: string;
    observations: string;
    office_phone: string;
    type_of_linkage: string;
    sede: number;
    job_relationship: number;
    email: string;
}
  
export enum TypeDocument {
    CC = 'CC',
    TI = 'TI',
    CE = 'CE',
    NIT = 'NIT',
    PAS = 'PAS'
}
export enum Gender {
    Masculino = 'Masculino',
    Femenino = 'Femenino',
}