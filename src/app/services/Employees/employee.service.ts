import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../models/Employee.model';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private employees_api = `${environment.apiBaseUrl}/employees`;
  private http = inject(HttpClient);

  public getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.employees_api);
  }

  public getEmployeeByEmployeeId(employeeId: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(`${this.employees_api}/find/${employeeId}`);
  }

  public getEmployeeByDni(employeeDni: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(`${this.employees_api}/find/byDni/${employeeDni}`);
  }

  public saveOrUpdate(formData: FormData): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(`${this.employees_api}/saveOrUpdate`, formData);
  }

  public updateInfo(employee: EmployeeModel): Observable<EmployeeModel> {
    return this.http.put<EmployeeModel>(`${this.employees_api}/updateInfo`, employee);
  }

  public deleteEmployee(employeeId: number): Observable<EmployeeModel> {
    return this.http.delete<EmployeeModel>(`${this.employees_api}/delete/${employeeId}`);
  }
}
