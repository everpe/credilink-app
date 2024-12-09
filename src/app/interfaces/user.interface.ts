  export interface User {
    id: number;
    username: string;
    names: string;
    surnames: string;
    email: string;
    type_user: string;
    type_document: string;
    document: string;
    department: string;
    city: string;
    cellphone: string;
    birthdate: string;
  }
  
  export interface UserResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
  }


  export interface CreateUserDto {
    username: string;
    names: string;
    surnames: string;
    email: string;
    type_user: string;
    type_document: string;
    document: string;
    department: string;
    city: string;
    cellphone: string;
    birthdate: string;
    sede: number;
  }
  
  export interface UserResponse {
    message: string; 
  }

  export enum UserType {
    ADMIN = 'ADMINISTRADOR',
    CEO = 'CEO',
    USER = 'FUNCIONAL'
  }

  export interface UpdateUserDto {
    type_document: string;
    names: string;
    document: string;
    department: string;
    city: string;
    cellphone: string;
    sede: number;
  }
  