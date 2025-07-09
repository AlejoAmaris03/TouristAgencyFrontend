import { Component, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from "./form/form.component";
import { TableComponent } from "./table/table.component";
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-customers',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TableComponent,
    MatTooltip
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})

export default class CustomersComponent {
  private dialog = inject(MatDialog);
  @ViewChild(TableComponent) private tableComponent!: TableComponent;

  protected openForm(): void {
    const dialogRef = this.dialog.open(FormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.tableComponent.getCustomers();
    });
  }

  protected searchCustomer(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tableComponent.filterCustomers(value);
  }
}
