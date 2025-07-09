import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { DateInputComponent, SelectInputComponent, PasswordInputComponent, NumberInputComponent, TextInputComponent } from '../';
import { HttpClient } from '@angular/common/http';
import { AdminService, AuthService, CustomersService, EmployeeService, JobTitleService, SweetAlertService, ToastrNotificationService } from '../../../services';
import { JobTitleModel } from '../../../models';

@Component({
  selector: 'app-update-info',
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NumberInputComponent,
    MatIconModule,
    NgIf,
    DateInputComponent,
    SelectInputComponent,
    PasswordInputComponent
  ],
  templateUrl: './update-info.component.html',
  styleUrl: './update-info.component.css'
})

export default class UpdateInfoComponent implements OnInit {
  protected submitted: boolean = false;
  protected showCommonFields: boolean = false;
  protected showEmployeeFields: boolean = false;
  protected form!: FormGroup;
  protected countries: any[] = [];
  protected countryNames: string[] = [];
  private countries_api: string = 'https://countriesnow.space/api/v0.1/countries';
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrNotificationService);
  private sweetAlertService = inject(SweetAlertService);
  private adminService = inject(AdminService);
  private customerService = inject(CustomersService);
  private employeeService = inject(EmployeeService);
  private userDni: number = this.authService.getUser().dni;
  private emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  protected formFields = [
    { name: 'dni', label: 'Enter your DNI' },
    { name: 'name', label: 'Enter your name' },
    { name: 'surname', label: 'Enter your surname' },
    { name: 'email', label: 'Enter your email' },
    { name: 'address', label: 'Enter your address' },
    { name: 'dateOfBirth', label: 'Enter your date of birth' },
    { name: 'nationality', label: 'Enter your nationality' },
    { name: 'phoneNumber', label: 'Enter your phone number' },
    { name: 'jobTitle', label: 'Enter your job title' },
    { name: 'salary', label: 'Enter your salary' },
    { name: 'username', label: 'Enter your username' },
    { name: 'password', label: 'Enter your password' }
  ];

  ngOnInit(): void {
    if(this.authService.getUser().role === 'ROLE_CUSTOMER' || this.authService.getUser().role === 'ROLE_EMPLOYEE')
      this.showCommonFields = true;

    if(this.authService.getUser().role === 'ROLE_EMPLOYEE')
      this.showEmployeeFields = true;

    this.form = this.fb.group({
      id: [''],
      dni: ['', [
        Validators.required,
        Validators.max(9999999999)
      ]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]],
      address: ['', !this.showCommonFields ? [] : Validators.required],
      dateOfBirth: ['', !this.showCommonFields ? [] : Validators.required],
      nationality: ['', !this.showCommonFields ? [] : Validators.required],
      phoneNumber: ['', !this.showCommonFields ? [] : [
        Validators.required,
        Validators.max(9999999999)
      ]],
      jobTitle: [{value: '', disabled: true}],
      salary: [{value: '', disabled: true}],
      username: [''],
      password: [''],
    });

    if(this.authService.getUser().role === 'ROLE_ADMIN')
      this.getAdminInfo();

    if(this.authService.getUser().role === 'ROLE_CUSTOMER')
      this.getCustomerInfo();

    if(this.authService.getUser().role === 'ROLE_EMPLOYEE')
      this.getEmployeeInfo();
  }

  protected onSubmit(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      const formToSend = { ...this.form.value };

      if(formToSend.username === '')
        delete formToSend.username;

      if(formToSend.password === '')
        delete formToSend.password;

      if(this.authService.getUser().role === 'ROLE_ADMIN')
        this.submitAdmin(formToSend);
      if(this.authService.getUser().role === 'ROLE_CUSTOMER')
        this.submitCustomer(formToSend);
      if(this.authService.getUser().role === 'ROLE_EMPLOYEE')
        this.submitEmployee(formToSend);

      this.submitted = false;
    }
  }

  private submitAdmin(formToSend: any): void {
    delete formToSend.address;
    delete formToSend.dateOfBirth;
    delete formToSend.nationality;
    delete formToSend.phoneNumber;

    this.adminService.updateInfo(formToSend).subscribe({
      next: (admin) => {
        if(admin)
          this.sweetAlertService.logoutAfteUpdate('Great!', 'Your information has been updated successfully!. Try lo login again', this.authService);
        else
          this.toastrService.showError('DNI or Username already exist!', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  private submitCustomer(formToSend: any): void {
    delete formToSend.jobTitle;
    delete formToSend.salary;

    formToSend.nationality = this.form.controls['nationality'].value.country;

    this.customerService.updateInfo(formToSend).subscribe({
      next: (customer) => {
        if(customer)
          this.sweetAlertService.logoutAfteUpdate('Great!', 'Your information has been updated successfully!. Try lo login again', this.authService);
        else
          this.toastrService.showError('DNI or Username already exist!', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });

    this.form.patchValue({
      nationality: ''
    });
  }

  private submitEmployee(formToSend: any): void {
    formToSend.nationality = this.form.controls['nationality'].value.country;
    
    this.employeeService.updateInfo(formToSend).subscribe({
      next: (customer) => {
        if(customer)
          this.sweetAlertService.logoutAfteUpdate('Great!', 'Your information has been updated successfully!. Try lo login again', this.authService);
        else
          this.toastrService.showError('DNI or Username already exist!', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });

    this.form.patchValue({
      nationality: ''
    });
  }

  private getAdminInfo(): void {
    this.adminService.getAdminByDni(this.userDni).subscribe({
      next: (admin) => {
        this.form.patchValue({
          id: admin.id,
          dni: admin.dni,
          name: admin.name,
          surname: admin.surname,
          email: admin.email
        });
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  private getCustomerInfo(): void {
    this.http.get<any>(this.countries_api).subscribe(countries => {
      this.countries = countries.data;
      this.countries.forEach(el => this.countryNames.push(el.country));

      this.customerService.getCustomerByDni(this.userDni).subscribe({
        next: (customer) => {
          const [year, month, day] = customer.dateOfBirth.toString().split('-').map(Number);

          this.form.patchValue({
            id: customer.id,
            dni: customer.dni,
            name: customer.name,
            surname: customer.surname,
            email: customer.email,
            address: customer.address,
            dateOfBirth: new Date(year, month - 1, day),
            phoneNumber: customer.phoneNumber,
            nationality: this.countries.find(c => c.country === customer.nationality)
          });
        },
        error: () => {
          if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      });
    });
  }

  private getEmployeeInfo(): void {
    this.http.get<any>(this.countries_api).subscribe(countries => {
      this.countries = countries.data;
      this.countries.forEach(el => this.countryNames.push(el.country));

      this.employeeService.getEmployeeByDni(this.userDni).subscribe({
        next: (employee) => {
          const [year, month, day] = employee.dateOfBirth.toString().split('-').map(Number);

          this.form.patchValue({
            id: employee.id,
            dni: employee.dni,
            name: employee.name,
            surname: employee.surname,
            email: employee.email,
            address: employee.address,
            dateOfBirth: new Date(year, month - 1, day),
            phoneNumber: employee.phoneNumber,
            nationality: this.countries.find(c => c.country === employee.nationality),
            jobTitle: employee.jobTitle.name,
            salary: employee.salary
          });
        },
        error: () => {
          if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      });
    });
  }
}