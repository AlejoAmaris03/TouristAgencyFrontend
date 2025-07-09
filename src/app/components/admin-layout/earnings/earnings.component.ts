import { Component, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TableComponent } from './table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { EarningsGraphsComponent } from './earnings-graphs/earnings-graphs.component';

@Component({
  selector: 'app-earnings',
  imports: [
    MatIcon,
    MatTooltip,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TableComponent,
    RouterLink
  ],
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.css'
})

export default class EarningsComponent {
  private dialog = inject(MatDialog);
  @ViewChild(TableComponent) private tableComponent!: TableComponent;


  protected openGraphs(): void {
    const dialogRef = this.dialog.open(EarningsGraphsComponent);
  }

  public searchSale(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.tableComponent.filterSales(value);
  }
}
