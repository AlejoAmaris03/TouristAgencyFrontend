import { Component, inject, OnInit } from '@angular/core';
import { TouristServiceModel } from '../../../models';
import { AuthService, SweetAlertService, ToastrNotificationService, TouristServicesService } from '../../../services';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatTooltip,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export default class HomeComponent implements OnInit {
  protected touristServices: TouristServiceModel[] =  [];
  private touristServiceServ = inject(TouristServicesService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);

  ngOnInit(): void {
    this.touristServiceServ.getTouristServices().subscribe({
      next: (touristService) => {
        this.touristServices = touristService;
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  protected getServiceImage(touristServiceId: number): any {
    return this.touristServiceServ.getTouristServiceImageById(touristServiceId);
  }

  protected getParsedDate(dateString: string): string {
    const [yearDate, monthDate, dayDate] = dateString.split('-').map(Number);
    const date = new Date(yearDate, monthDate - 1, dayDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}
