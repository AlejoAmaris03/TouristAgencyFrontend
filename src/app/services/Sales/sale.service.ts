import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { PurchaseModel, SaleDetailsModel, SaleModel, SalesDoneModel } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SaleService {
  private sales_api = `${environment.apiBaseUrl}/sales`;
  private http = inject(HttpClient);

  public getSales(): Observable<SaleDetailsModel[]> {
    return this.http.get<SaleDetailsModel[]>(this.sales_api);
  }

  public getSalesBySaleId(saleId: number): Observable<SaleDetailsModel> {
    return this.http.get<SaleDetailsModel>(`${this.sales_api}/find/sale/${saleId}`);
  }

  public getSalesByCustomerDni(customerDni: number): Observable<PurchaseModel[]> {
    return this.http.get<PurchaseModel[]>(`${this.sales_api}/find/purchases/${customerDni}`);
  }

  public getSalesByEmployeDni(employeeDni: number): Observable<SalesDoneModel[]> {
    return this.http.get<SalesDoneModel[]>(`${this.sales_api}/find/sales/${employeeDni}`);
  }

  public getBuyersByServiceId(serviceId: number): Observable<SaleDetailsModel[]> {
    return this.http.get<SaleDetailsModel[]>(`${this.sales_api}/find/buyers/${serviceId}`);
  }

  public getBuyersByPackageId(packageId: number): Observable<SaleDetailsModel[]> {
    return this.http.get<SaleDetailsModel[]>(`${this.sales_api}/find/purchasers/${packageId}`);
  }

  public buyServiceOrPackage(sale: SaleModel): Observable<SaleModel> {
    return this.http.post<SaleModel>(`${this.sales_api}/buyServiceOrPackage`, sale);
  }

  public deletePurchase(purchaseId: number): Observable<SaleModel> {
    return this.http.delete<SaleModel>(`${this.sales_api}/delete/${purchaseId}`);
  }
}
