import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PurchaseModel } from '../../../../models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { AuthService, SaleService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { SeeDetailsComponent } from '../see-details/see-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltip,
    NgIf
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {
  protected purchases: PurchaseModel[] = [];
  protected dataSource!: MatTableDataSource<PurchaseModel>;
  protected displayedColumns: string[] = ['id', 'type', 'service-package', 'date', 'price', 'info', 'cancel'];
  private saleService = inject(SaleService); 
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getPruchases();
  }

  public filterPurchases(value: string): void {
    if(this.purchases.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  protected seePurchaseDetails(purchaseId: number): void {
    this.saleService.getSalesBySaleId(purchaseId).subscribe({
      next: (sale) => {
        const dialogRef = this.dialog.open(SeeDetailsComponent, {
          data: sale
        });
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  protected cancelPurchase(purchaseId: number): void {
    this.toastrService.clearToastr();

    this.saleService.deletePurchase(purchaseId).subscribe({
      next: (purchase) => {
        if(purchase) {
          this.toastrService.showSuccess('Purchase deleted successfully', 'Great');
          this.getPruchases();
        }
        else
          this.toastrService.showError('You cannot delete this purchase', 'Error');
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  private getPruchases(): void {
    this.saleService.getSalesByCustomerDni(this.authService.getUser().dni).subscribe({
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
