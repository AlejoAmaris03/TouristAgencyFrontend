import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { AuthUserModel, CustomerModel } from '../../models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth_api = `${environment.apiBaseUrl}/auth`;
  private http = inject(HttpClient);

  public authenticate(user: AuthUserModel): Observable<AuthUserModel> {
    return this.http.post<AuthUserModel>(`${this.auth_api}/authenticate`, user).pipe(
      tap(user => {
        if(user)
          this.setToken(user);
      })
    );
  }

  public register(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(`${this.auth_api}/register`, customer);
  }
  
  public getToken(): string | null {
    if(typeof window != 'undefined')
      return localStorage.getItem('token');

    return null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();

    if(!token)
      return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = payload.exp * 1000;

    return Date.now() < expirationDate;
  }

  public getUser(): AuthUserModel {
    const token = this.getToken();
    const dni = JSON.parse(atob(token!.split('.')[1])).dni;
    const name = JSON.parse(atob(token!.split('.')[1])).name;
    const surname = JSON.parse(atob(token!.split('.')[1])).surname;
    const role = JSON.parse(atob(token!.split('.')[1])).role;
    const authUser: AuthUserModel = {
      dni: dni,
      name: name,
      surname: surname,
      token: '',
      role: role
    }

    return authUser;
  }

  public logout(): void {
    if(typeof window != 'undefined')
      localStorage.removeItem('token');
  }

  private setToken(user: AuthUserModel): void {
    localStorage.setItem('token', user.token)
  }
}
