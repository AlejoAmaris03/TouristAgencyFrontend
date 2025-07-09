import { CustomerModel } from "./Customer.model";
import { EmployeeModel } from "./Employee.model";
import { PaymentMethodModel } from "./PaymentMethod.model";
import { TouristServiceModel } from "./TouristService.model";
import { TourPackageModel } from "./TourPackage.model";

export interface SaleModel {
    id: number;
    dateOfSale: Date;
    paymentMethod: PaymentMethodModel;
    customer: CustomerModel;
    employee: EmployeeModel;
    touristService: TouristServiceModel;
    tourPackage: TourPackageModel;
}