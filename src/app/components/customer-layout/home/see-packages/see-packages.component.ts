import { Component, inject, OnInit } from '@angular/core';
import { TourPackageModel } from '../../../../models';
import { AuthService, SweetAlertService, ToastrNotificationService, TouristServicesService, TourPackageService } from '../../../../services';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-see-packages',
  imports: [
    MatTooltip,
    RouterLink
  ],
  templateUrl: './see-packages.component.html',
  styleUrl: './see-packages.component.css'
})

export default class SeePackagesComponent {
  protected tourPackages: TourPackageModel[] =  [];
  private tourPackageService = inject(TourPackageService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);

  ngOnInit(): void {
    this.tourPackageService.getTourPackages().subscribe({
      next: (tourPackages) => {
        this.tourPackages = tourPackages;
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }
}
