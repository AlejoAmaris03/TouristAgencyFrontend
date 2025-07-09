import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService, CustomersService, EmployeeService, PaymentMethodService, SaleService, SweetAlertService, ToastrNotificationService, TouristServicesService, TourPackageService } from '../../../../services';
import { CustomerModel, PaymentMethodModel, TouristServiceModel, TourPackageModel } from '../../../../models';
import { SelectInputComponent } from "../../../shared/Inputs/select-input/select-input.component";
import { MatError, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sale',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    MatTooltip,
    MatSelectModule,
    SelectInputComponent,
    MatError,
    NgIf
],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})

export default class SaleComponent implements OnInit {
  protected submitted: boolean = false;
  protected customers: CustomerModel[] = [];
  protected customerNames: string[] = [];
  protected touristServices: TouristServiceModel[] = [];
  protected tourPackages: TourPackageModel[] = [];
  protected paymentMethods: PaymentMethodModel[] = [];
  protected paymentMethodNames: string[] = [];
  protected form!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private customerService = inject(CustomersService);
  private employeeService = inject(EmployeeService);
  private touristServiceServ = inject(TouristServicesService);
  private tourPackageService = inject(TourPackageService);
  private paymentMethodService = inject(PaymentMethodService);
  private saleService = inject(SaleService);
  private dialogRef = inject(MatDialogRef<SaleComponent>);
  protected formFields = [
    { name: 'paymentMethod', label: 'Select the payment method' },
    { name: 'customer', label: 'Select the customer' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      employee: [''],
      touristService: [null],
      tourPackage: [null],
      customer: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    }, { validators: this.serviceOrPackageValidator });

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.customerNames = customers.map(customer => `${customer.name} ${customer.surname}`);
    });

    this.touristServiceServ.getTouristServices().subscribe(services => {
      this.touristServices = services;
    });

    this.tourPackageService.getTourPackages().subscribe(packages => {
      this.tourPackages = packages;
    });

    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.paymentMethods = paymentMethods;
      this.paymentMethodNames = paymentMethods.map(p => p.name);
    });

    this.employeeService.getEmployeeByDni(this.authService.getUser().dni).subscribe({
      next: (employee) => {
        this.form.patchValue({ 
          employee: employee 
        });
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
    this.dialogRef.close(false);
  }

  protected onSelectService(): void {
    this.form.patchValue({
      tourPackage: null
    });
  }

  protected onSelectPackage(): void {
    this.form.patchValue({
      touristService: null
    });
  }

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      this.saleService.buyServiceOrPackage(this.form.value).subscribe({
        next: (sale) => {
          if(sale) {
            this.toastrService.showSuccess('Service/Package sold successfully', 'Great');
            this.resetForm();
            this.dialogRef.close(true);
          }
          else 
            this.toastrService.showError('That customer already purchased that service/package', 'Error');
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
      customer: '',
      employee: '',
      paymentMethod: ''
    });
  }
}
