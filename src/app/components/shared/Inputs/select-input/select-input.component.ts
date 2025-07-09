import { Component, Input, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css'
})

export class SelectInputComponent {
  @Input() formField = { name: '', label: '' };
  @Input() form!: FormGroup;
  @Input() elements: any[] = [];
  @Input() elementNames: any[] = [];
}
