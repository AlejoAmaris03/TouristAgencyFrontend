import { RoleModel } from "./Role.model";

export interface AdminModel {
    id: number;
    name: string;
    surname: string;
    dni: number;
    email: string;
    role: RoleModel;
}