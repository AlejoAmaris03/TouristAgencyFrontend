import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css'
})

export class DateInputComponent {
  @Input() formField = { name: '', label: '' };
  @Input() form!: FormGroup;
}
