import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, SweetAlertService, ToastrNotificationService, TouristServicesService } from '../../../../services';
import { TouristServiceModel } from '../../../../models';
import { NgIf } from '@angular/common';
import { DateInputComponent, NumberInputComponent, TextInputComponent } from '../../../shared';
import { ImageInputComponent } from "../../../shared/Inputs/image-input/image-input.component";
import { TourPackagesComponent } from '../tour-packages/tour-packages.component';

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
    DateInputComponent,
    NgIf,
    ImageInputComponent
],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private touristServiceServ = inject(TouristServicesService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialogRef = inject(MatDialogRef<FormComponent>);
  private data = inject<TouristServiceModel>(MAT_DIALOG_DATA);
  protected formFields = [
    { name: 'name', label: 'Enter the name' },
    { name: 'description', label: 'Enter the description' },
    { name: 'destination', label: 'Enter the destination' },
    { name: 'date', label: 'Enter the date' },
    { name: 'price', label: 'Enter the price' },
    { name: 'image', label: 'Enter the image' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      id: '',
      name: ['', Validators.required],
      description: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', [
        Validators.required,
        Validators.max(9999999999)
      ]],
      image: [null, this.data ? [] : Validators.required],
    });

    if(this.data)
      this.getTouristServiceById(); 
  }

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      let action: string = this.form.controls['id'].value === '' ? 'add' : 'update';
      const formData = new FormData();

      const touristServiceToSend = { ...this.form.value };

      if(!touristServiceToSend.image) {
        this.form.patchValue({
          image: new Blob([],
            { type: 'image/jpeg' }
          )
        });
        delete touristServiceToSend.image;
      }

      formData.append('touristService', new Blob(
        [JSON.stringify(touristServiceToSend)],
        { type: 'application/json' }
      ))
      formData.append('image', this.form.controls['image'].value)
      formData.append('action', action);

      this.touristServiceServ.saveOrUpdate(formData).subscribe({
        next: (touristService) => {
          if(touristService) {
            action === 'add'
              ? this.toastrService.showSuccess('Tourist service added successfully', 'Great')
              : this.toastrService.showSuccess('Tourist service updated successfully', 'Great');

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

      this.submitted = false;
    }
  }

  public getTouristServiceById() {
    const [year, month, day] = this.data.date.toString().split('-').map(Number);

    this.form.patchValue({
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      destination: this.data.destination,
      date: new Date(year, month - 1, day),
      price: this.data.price,
    })
  }

  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({
      id: '',
    })
  }
}
