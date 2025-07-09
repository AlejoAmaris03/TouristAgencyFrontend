import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TextInputComponent } from "../../../shared/Inputs/text-input/text-input.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from "../../../shared/Inputs/number-input/number-input.component";
import { NgIf } from '@angular/common';
import { DateInputComponent } from "../../../shared/Inputs/date-input/date-input.component";
import { SelectInputComponent } from "../../../shared/Inputs/select-input/select-input.component";
import { PasswordInputComponent } from "../../../shared/Inputs/password-input/password-input.component";
import { HttpClient } from '@angular/common/http';
import { AuthService, EmployeeService, JobTitleService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { EmployeeModel, JobTitleModel } from '../../../../models';

@Component({
  selector: 'app-form',
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NumberInputComponent,
    MatIconModule,
    MatDialogModule,
    NgIf,
    DateInputComponent,
    SelectInputComponent,
    PasswordInputComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup;
  protected countries: any[] = [];
  protected jobTitles: JobTitleModel[] = [];
  protected countryNames: string[] = [];
  protected jobTitlesNames: string[] = [];
  private countries_api: string = 'https://countriesnow.space/api/v0.1/countries';
  private emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private jobTitleService = inject(JobTitleService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialogRef = inject(MatDialogRef<FormComponent>);
  private data = inject<EmployeeModel>(MAT_DIALOG_DATA);
  protected formFields = [
    { name: 'dni', label: 'Enter the DNI' },
    { name: 'name', label: 'Enter the name' },
    { name: 'surname', label: 'Enter the surname' },
    { name: 'email', label: 'Enter the email' },
    { name: 'address', label: 'Enter the address' },
    { name: 'dateOfBirth', label: 'Enter the date of birth' },
    { name: 'nationality', label: 'Enter the nationality' },
    { name: 'phoneNumber', label: 'Enter the phone number' },
    { name: 'jobTitle', label: 'Enter a job title' },
    { name: 'salary', label: 'Enter the salary' },
    { name: 'username', label: 'Enter the username' },
    { name: 'password', label: 'Enter the password' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      id: '',
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
      jobTitle: ['', Validators.required],
      salary: ['', [
        Validators.required,
        Validators.max(9999999999)
      ]],
      username: ['', this.data ? [] : Validators.required],
      password: ['', this.data ? [] : Validators.required],
      role: ''
    });

    this.http.get<any>(this.countries_api).subscribe(countries => {
      this.countries = countries.data;
      this.countries.forEach(el => this.countryNames.push(el.country));

      if(this.data) {
        this.form.patchValue({
          nationality: this.countries.find(c => c.country === this.data.nationality)
        })
      }
    });

    this.jobTitleService.getJobTitles().subscribe(jobTitles => {
      this.jobTitles = jobTitles;
      this.jobTitles.forEach(jT => this.jobTitlesNames.push(jT.name));

      if(this.data) {
        this.form.patchValue({
          jobTitle: this.jobTitles.find(jT => jT.name === this.data.jobTitle.name)
        })
      }
    });

    if(this.data)
      this.getEmployeeByEmployeeId(); 
  }

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      let action: string = this.form.controls['id'].value === '' ? 'add' : 'update';
      const formData = new FormData();

      this.form.patchValue({
        nationality: this.form.controls['nationality'].value.country,
        role: {
          id: 3,
          name: 'ROLE_EMPLOYEE'
        }
      });

      const employeeToSend = { ...this.form.value };

      if(!employeeToSend.username)
        delete employeeToSend.username;

      if(!employeeToSend.password)
        delete employeeToSend.password;

      formData.append('employee', new Blob(
        [JSON.stringify(employeeToSend)],
        { type: 'application/json' }
      ))
      formData.append('action', action);

      this.employeeService.saveOrUpdate(formData).subscribe({
        next: (employee) => {
          if(employee) {
            action === 'add'
              ? this.toastrService.showSuccess('Employee added successfully', 'Great')
              : this.toastrService.showSuccess('Employee updated successfully', 'Great');

            this.resetForm();
            this.dialogRef.close(true);
          }
          else
            this.toastrService.showError('Employee already exist', 'Error');
        },
        error: () => {
          if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else
            this.toastrService.showError('Something went wrong', 'Error');
        }
      })

      this.form.patchValue({
        nationality: ''
      })

      this.submitted = false;
    }
  }

  public getEmployeeByEmployeeId() {
    const [year, month, day] = this.data.dateOfBirth.toString().split('-').map(Number);

    this.form.patchValue({
      id: this.data.id,
      dni: this.data.dni,
      name: this.data.name,
      surname: this.data.surname,
      email: this.data.email,
      address: this.data.address,
      dateOfBirth: new Date(year, month - 1, day),
      phoneNumber: this.data.phoneNumber,
      salary: this.data.salary,
      username: '',
      password: ''
    })
  }

  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({
      id: '',
      jobTitle: ''
    })
  }
}
