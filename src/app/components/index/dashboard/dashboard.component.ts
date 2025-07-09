import { Component, inject, OnInit } from '@angular/core';
import { AuthService, SweetAlertService, ToastrNotificationService, TouristServicesService } from '../../../services';
import { TouristServiceModel } from '../../../models';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export default class DashboardComponent implements OnInit {
  protected touristServices: TouristServiceModel[] = [];
  private touristServiceServ = inject(TouristServicesService);
  private toastrService = inject(ToastrNotificationService);

  ngOnInit(): void {
    this.touristServiceServ.getTouristServices().subscribe({
      next: (touristServices) => {
        this.touristServices = touristServices;
      },
      error: () => {
        this.toastrService.showError('Something went', 'Error');
      }
    })
  }

  protected getTouristServiceImageById(touristServiceId: number): any {
    return this.touristServiceServ.getTouristServiceImageById(touristServiceId);
  }

  protected parseDate(dateString: string): string {
    const [yearDate, monthDate, dayDate] = dateString.split('-').map(Number);
    const date = new Date(yearDate, monthDate - 1, dayDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}
