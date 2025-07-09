import { NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SaleDetailsModel } from '../../../../../../models';
import { AuthService, SaleService, SweetAlertService, ToastrNotificationService } from '../../../../../../services';
import { ActivatedRoute } from '@angular/router';

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

export class TableComponent {
  protected purchases: SaleDetailsModel[] = [];
  protected dataSource!: MatTableDataSource<SaleDetailsModel>;
  protected displayedColumns: string[] = ['id', 'packageName', 'customerName', 'employeeName', 'dateOfSale', 'price'];
  private saleService = inject(SaleService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private route = inject(ActivatedRoute);
  protected packageId = Number(this.route.snapshot.paramMap.get("id"));

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getPurchases();
  }

  public filterPurchases(value: string): void {
    if(this.purchases.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public getPurchases(): void {
    this.saleService.getBuyersByPackageId(this.packageId).subscribe({
      next: (purchases) => {
        this.purchases = purchases;
        this.dataSource = new MatTableDataSource(purchases);
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
}
