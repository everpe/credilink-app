export interface CreateClientDto {
    first_name: string;
    last_name: string;
    document_type: TypeDocument;
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
    type_linkage: number;
    sede: number;
    job_relationship: number;
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

export interface JobRelationship {
    id: number;
    name: string;
    sede: number;
    company?: number;
}

export interface TypeLinkage {
    id: number;
    name: string;
    sede: number;
    company?: number;
}

export interface UpdateClientDto {
    first_name: string;
    last_name: string;
    document_type: string;
    document_number: string;
    place_of_issue: string;
    gender: string;
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
  }
  