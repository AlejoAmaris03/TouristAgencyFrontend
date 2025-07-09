import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInputComponent, TextInputComponent } from "../../shared/";
import { AuthService, SweetAlertService, ToastrNotificationService } from '../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    TextInputComponent,
    PasswordInputComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export default class LoginComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrNotificationService);
  private sweetAlertService = inject(SweetAlertService);
  private router = inject(Router);
  protected formFields = [
    { name: 'username', label: 'Enter your username' },
    { name: 'password', label: 'Enter your password' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  protected onSubmit() {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      this.authService.authenticate(this.form.value).subscribe({
        next: (user) => {
          if(user) {
            if(this.authService.getUser().role === 'ROLE_ADMIN')
              this.router.navigate(['/admin']);
            else if(this.authService.getUser().role === 'ROLE_CUSTOMER')
              this.router.navigate(['/home']);
            else if(this.authService.getUser().role === 'ROLE_EMPLOYEE')
              this.router.navigate(['/employee']);
          }
          else
            this.toastrService.showError('Invalid username or password', 'Error');
        },
        error: () => {
          if(!this.authService.isAuthenticated())
            this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
          else 
            this.toastrService.showError('Something went wrong during authentication', 'Error');
        }
      })

      this.submitted = false;
    }
  }
}
