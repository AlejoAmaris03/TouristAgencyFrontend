import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TextInputComponent } from "../../../shared/Inputs/text-input/text-input.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from "../../../shared/Inputs/number-input/number-input.component";
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService, PaymentMethodService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { PaymentMethodModel } from '../../../../models';

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
    NgIf
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  protected submitted: boolean = false;
  protected form!: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private paymentMethodService = inject(PaymentMethodService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialogRef = inject(MatDialogRef<FormComponent>);
  private data = inject<PaymentMethodModel>(MAT_DIALOG_DATA);
  protected formFields = [
    { name: 'name', label: 'Enter the name' },
    { name: 'commission', label: 'Enter the commission' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      id: '',
      name: ['', Validators.required],
      commission: ['', [
        Validators.required,
        Validators.max(50)
      ]]
    });

    if(this.data)
      this.getPaymentMethodById(); 
  }

  protected submitForm(): void {
    this.toastrService.clearToastr();
    this.submitted = true;

    if(this.form.valid) {
      let action: string = this.form.controls['id'].value === '' ? 'add' : 'update';
      const formData = new FormData();

      formData.append('paymentMethod', new Blob(
        [JSON.stringify(this.form.value)],
        { type: 'application/json' }
      ))
      formData.append('action', action);

      this.paymentMethodService.saveOrUpdate(formData).subscribe({
        next: (paymentMethod) => {
          if(paymentMethod) {
            action === 'add'
              ? this.toastrService.showSuccess('Payment Method added successfully', 'Great')
              : this.toastrService.showSuccess('Payment Method updated successfully', 'Great');

            this.resetForm();
            this.dialogRef.close(true);
          }
          else
            this.toastrService.showError('Payment method already exist', 'Error');
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

  public getPaymentMethodById() {
    this.form.patchValue({
      id: this.data.id,
      name: this.data.name,
      commission: this.data.commission
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({
      id: ''
    })
  }
}
