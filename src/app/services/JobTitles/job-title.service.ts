import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobTitleModel } from '../../models';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class JobTitleService {
  private jobTitles_api = `${environment.apiBaseUrl}/jobTitles`;
  private http = inject(HttpClient);

  public getJobTitles(): Observable<JobTitleModel[]> {
    return this.http.get<JobTitleModel[]>(this.jobTitles_api);  
  }
  
  public getJobTitleById(jobTitleId: number): Observable<JobTitleModel> {
    return this.http.get<JobTitleModel>(`${this.jobTitles_api}/find/${jobTitleId}`);
  }

  public saveOrUpdate(formData: FormData): Observable<JobTitleModel> {
    return this.http.post<JobTitleModel>(`${this.jobTitles_api}/saveOrUpdate`, formData);
  }

  public deleteJobTitle(jobTitleId: number): Observable<JobTitleModel> {
    return this.http.delete<JobTitleModel>(`${this.jobTitles_api}/delete/${jobTitleId}`);
  }
}
