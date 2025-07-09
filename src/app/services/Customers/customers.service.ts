import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerModel } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class CustomersService {
  private customers_api = `${environment.apiBaseUrl}/customers`;
  private http = inject(HttpClient);

  public getCustomers(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>(this.customers_api);
  }

  public getCustomerByCustomerId(customerId: number): Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.customers_api}/find/${customerId}`);
  }

  public getCustomerByDni(customerDni: number): Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.customers_api}/findByDni/${customerDni}`);
  }

  public saveOrUpdate(formData: FormData): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(`${this.customers_api}/saveOrUpdate`, formData);
  }

  public updateInfo(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(`${this.customers_api}/updateInfo`, customer);
  }

  public deleteCustomer(customerId: number): Observable<CustomerModel> {
    return this.http.delete<CustomerModel>(`${this.customers_api}/delete/${customerId}`);
  }
}
