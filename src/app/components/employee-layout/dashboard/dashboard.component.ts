import { Component, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableComponent } from "./table/table.component";
import { MatDialog } from '@angular/material/dialog';
import SaleComponent from './sale/sale.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export default class DashboardComponent {
  private dialog = inject(MatDialog);
  @ViewChild(TableComponent) private tableComponent!: TableComponent;

  protected openForm(): void {
    const dialogRef = this.dialog.open(SaleComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if(result === true)
        this.tableComponent.getSales();
    });
  }

  protected searchSale(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tableComponent.filterSales(value);
  }
}
