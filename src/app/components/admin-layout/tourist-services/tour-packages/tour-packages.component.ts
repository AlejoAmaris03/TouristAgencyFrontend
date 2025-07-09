import { NgIf } from '@angular/common';
import { Component, Host, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import TouristServicesComponent from '../tourist-services.component';
import { AuthService, SweetAlertService, ToastrNotificationService, TourPackageService } from '../../../../services';
import { TourPackageModel } from '../../../../models/TourPackage.model';
import { TouristServiceModel } from '../../../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-packages',
  imports: [
    MatIcon,
    MatTooltip,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
],
  templateUrl: './tour-packages.component.html',
  styleUrl: './tour-packages.component.css'
})

export class TourPackagesComponent implements OnInit {
  protected submitted: boolean = false;
  protected submittedToUpdate: boolean = false;
  protected showForm: boolean = false;
  protected form!: FormGroup;
  protected formToUpdateInfo: FormGroup[] = [];
  protected tourPackages: TourPackageModel[] = [];
  private touristServiceComp = inject(TouristServicesComponent);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tourPackageService = inject(TourPackageService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      touristServices: [[]]
    });

    this.getTourPackages();
  }

  public getTourPackages(): void {
    this.tourPackageService.getTourPackages().subscribe({
      next: (tourPackages) => {
        this.tourPackages = tourPackages;

        this.formToUpdateInfo = tourPackages.map(TP => this.fb.group({
          name: [TP.name, Validators.required]
        }));
      },
      error: () => {
        if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  protected showFormFunction(): void {
    this.showForm = !this.showForm;
  }

  protected onSubmit(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      if(this.touristServiceComp.getTouristServicesSelected().length >= 2) {
        this.form.patchValue({
          touristServices: this.touristServiceComp.getTouristServicesSelected()
        });

        this.tourPackageService.saveTourPackage(this.form.value).subscribe({
          next: (tourPackage) => {
            if(tourPackage) {
              this.toastrService.showSuccess('Package added successfully', 'Great');
              this.getTourPackages();

              this.showForm = false;
              this.touristServiceComp.clearCheckboxes();
              this.resetForm();
              this.submitted = false;
            }
            else
              this.toastrService.showError('Package already exists with that name or those services', 'Error');
          },
          error: () => {
            if(!this.authService.isAuthenticated())
                this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
            else
              this.toastrService.showError('Something went wrong', 'Error');
          }
        });
      }
      else
        this.toastrService.showWarning('You must select at least 2 services', 'Attention');
    }
  }

  protected updateName(tourPackageId: number, index: number): void {
    this.toastrService.clearToastr();
    this.submittedToUpdate = true;

    if(this.formToUpdateInfo[index].valid) {
      const formData = new FormData();

      formData.append('tourPackageId', tourPackageId.toString());
      formData.append('name', this.formToUpdateInfo[index].controls['name'].value);

      this.tourPackageService.updateName(formData).subscribe({
        next: (tourPackage) => {
          if(tourPackage) {
            this.toastrService.showSuccess("Package name updated successfully", 'Great');
            this.getTourPackages();
            this.resetUpdateForm(index);
            this.submittedToUpdate = false;
          }
          else
            this.toastrService.showError("Package name already exists", 'Error');
        },
        error: () => {
          if(!this.authService.isAuthenticated())
              this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      });
    }
  }

  protected addServices(tourPackage: TourPackageModel): void {
    this.toastrService.clearToastr();
    const tourPackageCopy: TourPackageModel = {
      ...tourPackage,
      touristServices: [...tourPackage.touristServices]
    };

    if(this.isServiceRepeated(tourPackage, this.touristServiceComp.getTouristServicesSelected())) {
      this.toastrService.showError("Some services already exist in that package", 'Error');
      return;
    }

    if(this.touristServiceComp.getTouristServicesSelected().length >= 1) {
      this.touristServiceComp.getTouristServicesSelected().forEach(ts => 
        tourPackageCopy.touristServices.push(ts)
      );

      this.tourPackageService.addServiceToPackage(tourPackageCopy).subscribe({
        next: (tourPackage) => {
          if(tourPackage) {
            this.toastrService.showSuccess("Services added successfully", 'Great');
            this.getTourPackages();
            this.touristServiceComp.clearCheckboxes();
          }
          else
            this.toastrService.showError("A package with those services already exists", 'Error');
        },
        error: () => {
          if(!this.authService.isAuthenticated())
              this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      });
    }
    else
      this.toastrService.showWarning('You must select at least 1 service', 'Attention');
  }

  protected removeService(tourPackageId: number, touristServiceId: number): void {
    this.toastrService.clearToastr();
    const formData = new FormData();

    formData.append('tourPackageId', tourPackageId.toString());
    formData.append('touristServiceId', touristServiceId.toString());

    this.tourPackageService.removeServiceFromPackage(formData).subscribe({
      next: (tourPackage) => {
        if(tourPackage) {
          this.toastrService.showSuccess("Service deleted successfully", 'Great');
          this.getTourPackages();
        }
        else
          this.toastrService.showError("If you delete that service, it'll repeat with other package", 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  protected deletePackage(packageId: number): void {
    this.toastrService.clearToastr();

    this.tourPackageService.deletePackage(packageId).subscribe({
      next: (tourPackage) => {
        if(tourPackage) {
          this.toastrService.showSuccess('Package deleted successfully', 'Great');
          this.getTourPackages();
        }
        else
          this.toastrService.showError('Package is already used', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  protected closeForm(): void {
    this.showForm = false;
    this.resetForm();
    this.touristServiceComp.clearCheckboxes();
  }

  private isServiceRepeated(tourPackage: TourPackageModel, services: TouristServiceModel[]): boolean {
    return services.some(s => 
      tourPackage.touristServices.some(tp => tp.id === s.id)
    );
  }

  private resetForm(): void {
    this.form.reset();
  }

  private resetUpdateForm(index: number): void {
    this.formToUpdateInfo[index].reset();
  }
}
