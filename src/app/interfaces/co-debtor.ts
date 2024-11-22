import { TypeLinkage, JobRelationship } from "./client.interface";




export interface CreatedBy {
    id: number;
    username: string;
}

export interface CoDebtorDto {
    id: number;
    first_name: string;
    last_name: string;
    type_document: string;
    place_of_issue: string;
    gender: string;
    mobile: string;
    address: string;
    neighborhood: string;
    city: string;
    observations: string;
    office_phone: string;
    type_linkage: TypeLinkage;
    document_number: string;
    phone: string;
    job_relationship: JobRelationship;
    created_by: CreatedBy;
    created_at: string;
    email: string;
    status: boolean;
}





  
  
  export interface CreateCoDebtorDto {
    first_name: string;
    last_name: string;
    type_document: string;
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
    type_linkage: number;
    sede: number;
    job_relationship: number;
    email: string;
  }
  
  export interface UpdateCoDebtorDto {
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
    type_linkage: number;
    sede: number;
    job_relationship: number;
    email: string;
  }
  