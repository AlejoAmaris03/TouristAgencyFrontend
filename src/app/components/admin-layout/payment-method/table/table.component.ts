import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaymentMethodModel } from '../../../../models';
import { AuthService, PaymentMethodService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component'

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
  protected paymentMethods: PaymentMethodModel[] = [];
  protected dataSource!: MatTableDataSource<PaymentMethodModel>;
  protected displayedColumns: string[] = ['id', 'name', 'commission', 'info', 'delete'];
  private paymentMethodService = inject(PaymentMethodService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getPaymentMethods();
  }

  public filterPaymentMethods(value: string): void {
    if(this.paymentMethods.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public getPaymentMethods(): void {
    this.paymentMethodService.getPaymentMethods().subscribe(paymentMethods => {
      this.paymentMethods = paymentMethods;
      this.dataSource = new MatTableDataSource(paymentMethods);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  protected updatePaymentMethods(paymentMethodId: number): void {
    this.paymentMethodService.getPaymentMethodById(paymentMethodId).subscribe({
      next: (paymentMethod) => {
        const dialogRef = this.dialog.open(FormComponent, {
          data: paymentMethod
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === true)
            this.getPaymentMethods();
        });
      },
      error: () => {
        if(!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }

  protected deletePaymentMethod(paymentMethodId: number): void {
    this.toastrService.clearToastr();

    this.paymentMethodService.deletePaymentMethod(paymentMethodId).subscribe({
      next: (paymentMethod) => {
        if(paymentMethod) {
          this.toastrService.showSuccess('Payment method deleted successfully', 'Great');
          this.getPaymentMethods();
        }
        else
          this.toastrService.showError('The payment method is being used', 'Error');
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    })
  }
}
