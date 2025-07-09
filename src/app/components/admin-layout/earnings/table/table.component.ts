import { NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SaleDetailsModel } from '../../../../models';
import { AuthService, SaleService, SweetAlertService, ToastrNotificationService } from '../../../../services';

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
  protected sales: SaleDetailsModel[] = [];
  protected dataSource!: MatTableDataSource<SaleDetailsModel>;
  protected displayedColumns: string[] = ['id', 'serviceOrPackage', 'dateOfSale', 'customerName', 'employeeName', 'paymentMethod', 'price'];
  private saleService = inject(SaleService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getSales();
  }

  public getSales(): void {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.dataSource = new MatTableDataSource(sales);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  public filterSales(value: string): void {
    if(this.sales.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
