import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TextInputComponent } from "../../../shared/Inputs/text-input/text-input.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobTitleModel } from '../../../../models';
import { AuthService, JobTitleService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-job-title',
  imports: [
    MatIcon,
    MatTooltip,
    RouterLink,
    TextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './job-title.component.html',
  styleUrl: './job-title.component.css'
})

export default class JobTitleComponent implements OnInit {
  protected submitted: boolean = false;
  protected jobTitles: JobTitleModel[] = [];
  protected form!: FormGroup;
  protected formFields = [
    { name: 'name', label: 'Enter the name' }
  ];
  private fb = inject(FormBuilder);
  private jobTitleService = inject(JobTitleService);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrNotificationService);
  private sweetAlertService = inject(SweetAlertService);

  ngOnInit(): void {
    this.form = this.fb.group({
      id: '',
      name: ['', Validators.required]
    })

    this.getJobTitles();
  }

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      let action: string = this.form.controls['id'].value === '' ? 'add' : 'update';
      const formData = new FormData();

      formData.append('jobTitle', new Blob(
        [JSON.stringify(this.form.value)],
        { type: 'application/json' }
      ));
      formData.append('action', action);

      this.jobTitleService.saveOrUpdate(formData).subscribe({
        next: (jobTitle) => {
          if(jobTitle) {
            action === 'add' 
              ? this.toastrService.showSuccess('Job title added successfully', 'Great')
              : this.toastrService.showSuccess('Job title updated successfully', 'Great');

            this.resetForm();
            this.getJobTitles();
          }
          else
            this.toastrService.showError('Job title already exists', 'Error');
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

  protected getJobTitleById(jobTitleId: number): void {
    this.toastrService.clearToastr();

    this.jobTitleService.getJobTitleById(jobTitleId).subscribe({
      next: (jobTitle) => {
        this.form.patchValue({
          id: jobTitle.id,
          name: jobTitle.name
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

  protected deleteJobTitle(jobTitleId: number): void {
    this.toastrService.clearToastr();
    
    this.jobTitleService.deleteJobTitle(jobTitleId).subscribe({
      next: (jobTitle) => {
        if(jobTitle) {
          this.toastrService.showSuccess('Job title deleted successfully', 'Great')
          this.getJobTitles();
        }
        else
          this.toastrService.showError('There are employees with that feature', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  private getJobTitles(): void {
    this.jobTitleService.getJobTitles().subscribe({
      next: (jobTitles) => {
        this.jobTitles = jobTitles;
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({
      id: ''
    })
  }
}
