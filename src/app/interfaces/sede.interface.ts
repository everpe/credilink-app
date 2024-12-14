import { CompanyDto } from "./company.interface";

export interface SedeDto {
    id: number;
    name: string;
    responsible_name: string;
    surnames_responsible: string;
    company: Pick<CompanyDto, 'id' | 'company_name'>; // Reutiliza solo los campos necesarios
    rut: string;
    corporate_email: string;
    city: string;
    address: string;
    coporative_phone: string;
    type_of_responsible_document: string;
    responsible_phone: string;
    responsible_email: string;
    status: boolean;
}

export interface CreateSedeDto {
    name: string;
    responsible_name: string;
    surnames_responsible: string;
    company: number; // ID de la compañía
    rut: string;
    corporate_email: string;
    city: string;
    address: string;
    coporative_phone: string;
    type_of_responsible_document: string;
    responsible_phone: string;
    responsible_email: string;
    send_notifications: boolean;
}
