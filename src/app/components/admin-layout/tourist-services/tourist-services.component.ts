import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FormComponent } from './form/form.component';
import { AuthService, SweetAlertService, ToastrNotificationService, TouristServicesService } from '../../../services';
import { TouristServiceModel } from '../../../models';
import { NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { TourPackagesComponent } from "./tour-packages/tour-packages.component";

@Component({
  selector: 'app-tourist-services',
  imports: [
    MatIcon,
    NgIf,
    MatTooltip,
    TourPackagesComponent
],
  templateUrl: './tourist-services.component.html',
  styleUrl: './tourist-services.component.css'
})

export default class TouristServicesComponent implements OnInit {
  @ViewChild(TourPackagesComponent) private tourPackageComp!: TourPackagesComponent;
  protected touristServices: TouristServiceModel[] = [];
  private touristServicesSelected: TouristServiceModel[] = [];
  private touristServiceServ = inject(TouristServicesService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getTouristServices();
  }

  public getTouristServicesSelected(): TouristServiceModel[] {
    return this.touristServicesSelected;
  }

  public clearCheckboxes(): void {
    (document.getElementsByName('service') as NodeListOf<HTMLInputElement>)
      .forEach(c => c.checked = false);

    this.touristServicesSelected = [];
  }

  protected openForm(): void {
    const dialogRef = this.dialog.open(FormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true)
        this.getTouristServices();
    })
  }

  protected onClickCheckbox(event:Event, touristService: TouristServiceModel): void {
    const checkbox = (event.target as HTMLInputElement);

    if(checkbox.checked)
      this.touristServicesSelected.push(touristService);
    else {
      const index = this.touristServicesSelected.findIndex(c => c.id === touristService.id);
      this.touristServicesSelected.splice(index, 1);
    }
  }

  protected openServiceDetails(touristServiceId: number): void {
    this.touristServiceServ.getTouristServiceById(touristServiceId).subscribe({
      next: (touristService) => {
        const dialogRef = this.dialog.open(ServiceDetailsComponent, {
          data: touristService
        });
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  protected updateService(touristServiceId: number): void {
    this.touristServiceServ.getTouristServiceById(touristServiceId).subscribe({
      next: (touristService) => {
        const dialogRef = this.dialog.open(FormComponent, {
          data: touristService
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === true){
            this.getTouristServices();
            this.tourPackageComp.getTourPackages();
          }
        })
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  protected deleteTouristService(touristServiceId: number): void {
    this.toastrService.clearToastr();
    
    this.touristServiceServ.deleteTouristService(touristServiceId).subscribe({
      next: (touristService) => {
        if(touristService) {
          this.toastrService.showSuccess('Tourist service deleted successfully', 'Great')
          this.getTouristServices();
        }
        else
          this.toastrService.showError('There are features with that service', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  private getTouristServices(): void {
    this.touristServiceServ.getTouristServices().subscribe({
      next: (touristServices) => {
        this.touristServices = touristServices;
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
