import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminModel } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  private admins_api = `${environment.apiBaseUrl}/admins`;
  private http = inject(HttpClient);

  public getAdminByDni(adminDni: number): Observable<AdminModel> {
    return this.http.get<AdminModel>(`${this.admins_api}/find/${adminDni}`);
  }

  public updateInfo(admin: AdminModel): Observable<AdminModel> {
    return this.http.post<AdminModel>(`${this.admins_api}/updateInfo`, admin);
  }
}
