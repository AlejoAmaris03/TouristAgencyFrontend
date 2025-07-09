import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-input',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.css'
})

export class ImageInputComponent {
  @Input() formField = { name: '', label: '' };
  @Input() form!: FormGroup;

  protected onSelectFile(event: Event): void {
    const file = (event.target as HTMLInputElement);

    if(file.files && file.files.length > 0) {
      this.form.patchValue({
        image: file.files[0]
      });

      (document.getElementById("imageName") as HTMLElement).textContent = 
        `${this.formField.label} - ${file.files[0].name}`
    }
  }
}
