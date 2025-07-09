export interface SalesDoneModel {
    id: number;
    dateOfSale: Date;
    paymentMethod: string;
    customerName: string;
    touristServiceName: string;
    tourPackageName: string;
    price: number;
    commissionPercentage: number;
    commisionTotal: number;
}   