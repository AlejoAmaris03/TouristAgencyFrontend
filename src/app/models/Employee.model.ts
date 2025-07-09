import { CustomerModel } from "./Customer.model";
import { JobTitleModel } from "./JobTitle.model";

export interface EmployeeModel extends CustomerModel {
    jobTitle: JobTitleModel;
    salary: number;
}