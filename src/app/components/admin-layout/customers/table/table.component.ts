import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomerModel } from '../../../../models';
import { AuthService, CustomersService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';

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
  protected customers: CustomerModel[] = [];
  protected dataSource!: MatTableDataSource<CustomerModel>;
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'dni', 'dateOfBirth', 'email', 'nationality', 'address', 'phoneNumber', 'info', 'delete'];
  private customerService = inject(CustomersService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getCustomers();
  }

  public filterCustomers(value: string): void {
    if(this.customers.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public getCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.dataSource = new MatTableDataSource(customers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  protected updateCustomer(customerId: number): void {
    this.customerService.getCustomerByCustomerId(customerId).subscribe({
      next: (customer) => {
        const dialogRef = this.dialog.open(FormComponent, {
          data: customer
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === true)
            this.getCustomers();
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

  protected deleteCustomer(customerId: number): void {
    this.toastrService.clearToastr();

    this.customerService.deleteCustomer(customerId).subscribe({
      next: (customer) => {
        if(customer) {
          this.toastrService.showSuccess('Customer deleted successfully', 'Great');
          this.getCustomers();
        }
        else
          this.toastrService.showError('The customer has some purchases', 'Error');
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
