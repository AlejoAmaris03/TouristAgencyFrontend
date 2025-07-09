import { RoleModel } from "./Role.model";

export interface CustomerModel {
    id: number;
    name: string;
    surname: string;
    address: string;
    dni: number;
    dateOfBirth: Date;
    nationality: string;
    phoneNumber: number;
    email: string;
    role: RoleModel;
}