export interface SaleDetailsModel {
    id: number;
    description: string;
    destination: string;
    dateOfSale: Date;
    date: Date;
    paymentMethod: string;
    customerName: string;
    employeeName: string;
    touristServiceName: string;
    tourPackageName: string;
    servicesIncluded: string[];
    price: number;
}