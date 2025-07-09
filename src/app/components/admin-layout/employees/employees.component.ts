import { Component, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from "./table/table.component";
import { FormComponent } from './form/form.component';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-employees',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TableComponent,
    MatTooltip,
    RouterLink
],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})

export default class EmployeesComponent {
  private dialog = inject(MatDialog);
  @ViewChild(TableComponent) private tableComponent!: TableComponent;

  protected openForm(): void {
    const dialogRef = this.dialog.open(FormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true){}
        this.tableComponent.getEmployees();
    });
  }

  protected searchEmployee(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tableComponent.filterEmployees(value);
  }
}
