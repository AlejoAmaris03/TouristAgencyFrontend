import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService, EmployeeService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormComponent } from '../form/form.component';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { EmployeeModel } from '../../../../models';

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
  protected employees: EmployeeModel[] = [];
  protected dataSource!: MatTableDataSource<EmployeeModel>;
  protected displayedColumns: string[] = ['id', 'name', 'surname', 'dni', 'dateOfBirth', 'email', 'nationality', 'jobTitle', 'salary', 'info', 'delete'];
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;

  ngOnInit(): void {
    this.getEmployees();
  }

  public filterEmployees(value: string): void {
    if(this.employees.length > 0) {
      this.dataSource.filter = value.trim().toLowerCase();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.dataSource = new MatTableDataSource(employees);
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

  protected updateEmployee(employeeId: number): void {
    this.employeeService.getEmployeeByEmployeeId(employeeId).subscribe({
      next: (employee) => {
        const dialogRef = this.dialog.open(FormComponent, {
          data: employee
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result === true)
            this.getEmployees();
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

  protected deleteEmployee(employeeId: number): void {
    this.toastrService.clearToastr();

    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (employee) => {
        if(employee) {
          this.toastrService.showSuccess('Employee deleted successfully', 'Great');
          this.getEmployees();
        }
        else
          this.toastrService.showError('The employee has some sales', 'Error');
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
