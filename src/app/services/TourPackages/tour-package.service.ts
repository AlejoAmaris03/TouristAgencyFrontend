import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourPackageModel } from '../../models/TourPackage.model';

@Injectable({
  providedIn: 'root'
})

export class TourPackageService { 
  private tourPackage_api = `${environment.apiBaseUrl}/tourPackages`;
  private http = inject(HttpClient);

  public getTourPackages(): Observable<TourPackageModel[]> {
    return this.http.get<TourPackageModel[]>(this.tourPackage_api);
  }

  public saveTourPackage(tourPackage: TourPackageModel): Observable<TourPackageModel> {
    return this.http.post<TourPackageModel>(`${this.tourPackage_api}/saveTourPackage`, tourPackage);
  }

  public updateName(formData: FormData): Observable<TourPackageModel> {
    return this.http.put<TourPackageModel>(`${this.tourPackage_api}/updateName`, formData);
  }

  public addServiceToPackage(tourPackage: TourPackageModel): Observable<TourPackageModel> {
    return this.http.put<TourPackageModel>(`${this.tourPackage_api}/addServiceToPackage`, tourPackage);
  }

  public removeServiceFromPackage(formData: FormData): Observable<TourPackageModel> {
    return this.http.put<TourPackageModel>(`${this.tourPackage_api}/removeServiceFromPackage`, formData);
  }

  public deletePackage(tourPackageId: number): Observable<TourPackageModel> {
    return this.http.delete<TourPackageModel>(`${this.tourPackage_api}/deletePackage/${tourPackageId}`);
  }
}
