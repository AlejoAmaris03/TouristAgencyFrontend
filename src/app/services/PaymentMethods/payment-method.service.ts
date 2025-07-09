import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethodModel } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class PaymentMethodService {
  private paymentMethod_api = `${environment.apiBaseUrl}/paymentMethods`;
  private http = inject(HttpClient);

  public getPaymentMethods(): Observable<PaymentMethodModel[]> {
    return this.http.get<PaymentMethodModel[]>(this.paymentMethod_api);
  }

  public getPaymentMethodById(paymentMethodId: number): Observable<PaymentMethodModel> {
    return this.http.get<PaymentMethodModel>(`${this.paymentMethod_api}/find/${paymentMethodId}`);    
  }

  public saveOrUpdate(formData: FormData): Observable<PaymentMethodModel> {
    return this.http.post<PaymentMethodModel>(`${this.paymentMethod_api}/saveOrUpdate`, formData);  
  }

  public deletePaymentMethod(paymentMethodId: number): Observable<PaymentMethodModel> {
    return this.http.delete<PaymentMethodModel>(`${this.paymentMethod_api}/delete/${paymentMethodId}`);    
  }
}
