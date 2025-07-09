import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-purchases',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TableComponent,
    MatTooltip,
    RouterLink
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})

export default class PurchasesComponent {
  @ViewChild(TableComponent) private tableComponent!: TableComponent;

  protected searchPurchases(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tableComponent.filterPurchases(value);
  }
}
