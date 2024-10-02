export interface CoDebtor {
    id: number;
    first_name: string;
    last_name: string;
    type_document: string;
    document_number: string;
    place_of_issue: string;
    gender: string;
    mobile: string;
    phone: string;
    address: string;
    neighborhood: string;
    city: string;
    observations: string;
    office_phone: string;
    type_of_linkage: string;
    job_relationship: {
      id: number;
      name: string;
    };
    created_by: {
      id: number;
      username: string;
    };
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
    type_of_linkage: string;
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
    type_of_linkage: string;
    sede: number;
    job_relationship: number;
    email: string;
  }
  