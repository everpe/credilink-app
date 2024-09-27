export interface LoginRequestDto {
    username: string;
    password: string;
}
export interface Sede {
    id: number;
    name: string;
}

export interface Company {
    id: number;
    company_name: string;
    sedes: Sede[];
}

export interface UserData {
    id: number;
    username: string;
    type_user: string;
    company: Company;
}

export interface LoginResponseDto {
    message: string;
    token: string;
    data: UserData;
}
