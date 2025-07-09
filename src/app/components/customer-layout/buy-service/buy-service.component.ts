import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EmployeeModel, PaymentMethodModel, TouristServiceModel } from '../../../models';
import { AuthService, CustomersService, EmployeeService, 
          PaymentMethodService, SaleService, 
          SweetAlertService, ToastrNotificationService, 
          TouristServicesService, TourPackageService } from '../../../services';
import { SelectInputComponent } from "../../shared/Inputs/select-input/select-input.component";
import { TourPackageModel } from '../../../models/TourPackage.model';

@Component({
  selector: 'app-buy-service',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatTooltip,
    RouterLink,
    NgIf,
    NgClass,
    NgFor,
    MatSelectModule,
    SelectInputComponent
],
  templateUrl: './buy-service.component.html',
  styleUrl: './buy-service.component.css'
})

export default class BuyServiceComponent implements OnInit {
  protected form!: FormGroup;
  protected submitted: boolean = false;
  protected scalePackageSelectedId!: number | null;
  protected showDetails: boolean = false;
  protected showServiceInfo: boolean = false;
  protected showPackageInfo: boolean = false;
  protected serviceSelected: number = 0;
  protected packageSelected: number = 0;
  protected touristServices: TouristServiceModel[] = [];
  protected tourPackages: TourPackageModel[] = [];
  protected tourPackagesToShow: TourPackageModel[] = [];
  protected employees: EmployeeModel[] = [];
  protected paymentMethods: PaymentMethodModel[] = [];
  protected employeeNames: string [] = [];
  protected paymentMethodNames: string [] = [];
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private touristServiceServ = inject(TouristServicesService);
  private tourPackageServ = inject(TourPackageService);
  private employeeService = inject(EmployeeService);
  private customerService = inject(CustomersService);
  private paymentMethodService = inject(PaymentMethodService);
  private saleService = inject(SaleService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  protected touristServiceId = this.route.snapshot.paramMap.get('id');
  protected formFields = [
    { name: 'employee', label: 'Choose the seller' },
    { name: 'paymentMethod', label: 'Choose the payment method' }
  ]

  ngOnInit(): void {
    this.form = this.fb.group({
      customer: [''],
      touristService: [null],
      tourPackage: [null],
      employee: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    }, { validators: this.serviceOrPackageValidator });

    this.touristServiceServ.getTouristServices().subscribe({
      next: (touristService) => {
        this.touristServices = touristService;

        if(this.touristServiceId) {
          this.form.patchValue({
            touristService: touristService.find(TS => TS.id === Number(this.touristServiceId))
          });

          this.onSelectService();
        }
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });

    this.tourPackageServ.getTourPackages().subscribe({
      next: (tourPackages) => {
        this.tourPackages = tourPackages;

        if(this.touristServiceId)
          this.findPackageByService(Number(this.touristServiceId));
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });

    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.employees.forEach(e => this.employeeNames.push(`${e.name} ${e.surname}`));
    });

    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.paymentMethods = paymentMethods;
      this.paymentMethods.forEach(pm => this.paymentMethodNames.push(`${pm.name}`));
    });

    this.customerService.getCustomerByDni(this.authService.getUser().dni).subscribe(customer => {
      this.form.patchValue({
        customer: customer
      })
    });
  }

  protected findPackageByService(touristServiceId: number): void {
    this.tourPackagesToShow = [];

    this.tourPackages.forEach(TP => {
      TP.touristServices.forEach(TS => {
        if(TS.id === touristServiceId)
          this.tourPackagesToShow.push(TP); 
      })
    })
  }

  protected onSelectService(): void {
    const service: TouristServiceModel = this.form.get('touristService')?.value;
    this.showDetails = this.showServiceInfo = true;
    this.showPackageInfo = false;
    this.serviceSelected = this.touristServices.findIndex(TS => TS.id === service.id);
    this.findPackageByService(service.id);
    this.scalePackageSelectedId = null;
    this.form.patchValue({
      tourPackage: null
    });
  }

  protected onSelectPackage(packageId: number): void {
    this.scalePackageSelectedId = this.scalePackageSelectedId === packageId ? null : packageId;

    if(this.scalePackageSelectedId === packageId) {
      this.showServiceInfo = false;
      this.showDetails = this.showPackageInfo = true;
      this.packageSelected = this.tourPackages.findIndex(TP => TP.id === packageId);
    }
    else
      this.showDetails = this.showPackageInfo = false;

    this.form.patchValue({
      touristService: null,
      tourPackage: this.scalePackageSelectedId === packageId 
        ? this.tourPackages.find(TP => TP.id === packageId) 
        : null
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

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      this.saleService.buyServiceOrPackage(this.form.value).subscribe({
        next: (sale) => {
          if(sale) {
            this.toastrService.showSuccess('Service/Package purchased successfully', 'Great');
            this.resetForm();
          }
          else 
            this.toastrService.showError('You have already purchased that service or package', 'Error');
        },
        error: () => {
          if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      });

      this.submitted = false;
    }
  }

  private serviceOrPackageValidator(control: AbstractControl): ValidationErrors | null {
    const service = control.get('touristService')?.value;
    const packageField = control.get('tourPackage')?.value;
  
    if(!service && !packageField)
      return { serviceOrPackageRequired: true };
  
    return null;
  }

  private resetForm(): void {
    this.form.patchValue({
      touristService: null,
      tourPackage: null,
      employee: '',
      paymentMethod: ''
    });

    this.tourPackagesToShow = [];
    this.scalePackageSelectedId = null;
    this.showDetails = this.showServiceInfo = this.showPackageInfo = false;
    this.serviceSelected = this.packageSelected = 0;
  }
}
