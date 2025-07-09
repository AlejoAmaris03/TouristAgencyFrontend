import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TouristServiceModel } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class TouristServicesService {
  private touristServices_api = `${environment.apiBaseUrl}/touristServices`;
  private http = inject(HttpClient);

  public getTouristServices(): Observable<TouristServiceModel[]> {
    return this.http.get<TouristServiceModel[]>(this.touristServices_api);
  }

  public getTouristServiceById(touristServiceId: number): Observable<TouristServiceModel> {
    return this.http.get<TouristServiceModel>(`${this.touristServices_api}/find/${touristServiceId}`);
  }

  public getTouristServiceImageById(touristServiceId: number): any {
    return `${this.touristServices_api}/image/${touristServiceId}`;
  }

  public saveOrUpdate(formData: FormData): Observable<TouristServiceModel> {
    return this.http.post<TouristServiceModel>(`${this.touristServices_api}/saveOrUpdate`, formData);
  }

  public deleteTouristService(touristServiceId: number): Observable<TouristServiceModel> {
    return this.http.delete<TouristServiceModel>(`${this.touristServices_api}/delete/${touristServiceId}`);
  }
}
