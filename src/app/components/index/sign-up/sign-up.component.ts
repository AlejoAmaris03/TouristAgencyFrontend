import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService, ToastrNotificationService } from '../../../services';
import { DateInputComponent, NumberInputComponent, PasswordInputComponent, SelectInputComponent, TextInputComponent } from '../../shared';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export default class SignUpComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup;
  protected countries: any[] = [];
  protected countryNames: any[] = [];
  private countries_api: string = 'https://countriesnow.space/api/v0.1/countries';
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrNotificationService);
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
    { name: 'username', label: 'Enter your username' },
    { name: 'password', label: 'Enter your password' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
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
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationality: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.max(9999999999)
      ]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ''
    });

    this.http.get<any>(this.countries_api).subscribe(countries => {
      this.countries = countries.data;
      this.countries.forEach(el => this.countryNames.push(el.country));
    });
  }

  protected onSubmit() {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      this.form.patchValue({
        nationality: this.form.controls['nationality'].value.country,
        role: {
          id: 2,
          name: 'ROLE_CUSTOMER'
        }
      });

      this.authService.register(this.form.value).subscribe({
        next: (customer) => {
          if(customer) {
            this.toastrService.showSuccess("You've been added successfully. Try to login", 'Great')
            this.resetForm();
          }
          else
            this.toastrService.showError('Username or DNI already exists', 'Error');
        },
        error: () => {
          this.toastrService.showError('Something went wrong during registration', 'Error');
        }
      });

      this.form.patchValue({
        nationality: ''
      })

      this.submitted = false;
    }
  }

  private resetForm(): void {
    this.form.reset();
  }
}
