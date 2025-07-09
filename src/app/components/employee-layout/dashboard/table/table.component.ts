import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SalesDoneModel } from '../../../../models';
import { AuthService, SaleService } from '../../../../services';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {
  protected sales: SalesDoneModel[] = [];
  protected dataSource!: MatTableDataSource<SalesDoneModel>;
  protected displayedColumns: string[] = ['id', 'serviceOrPackage', 'customerName', 'paymentMethod', 'commission', 'price', 'total'];
  private saleService = inject(SaleService);
  private authService = inject(AuthService);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getSales();
  }

  public filterSales(value: string): void {
    if(this.sales.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public getSales(): void {
    this.saleService.getSalesByEmployeDni(this.authService.getUser().dni).subscribe(sales => {
      this.sales = sales;
      this.dataSource = new MatTableDataSource(sales);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
