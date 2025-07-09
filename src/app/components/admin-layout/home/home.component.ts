import { Component, inject, OnInit } from '@angular/core';
import { GraphsComponent } from "./graphs/graphs.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomersService, EmployeeService, SaleService, TouristServicesService } from '../../../services';
import { CustomerModel, SaleDetailsModel, SaleModel } from '../../../models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    GraphsComponent,
    MatProgressSpinnerModule,
    RouterLink,
    MatTooltipModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export default class HomeComponent implements OnInit {
  protected customers: CustomerModel[] = [];
  protected sales: SaleDetailsModel[] = [];
  private customerService = inject(CustomersService);
  private employeeService = inject(EmployeeService);
  private touristServicesServ = inject(TouristServicesService);
  private saleService = inject(SaleService);

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      (document.getElementById('customers-number') as HTMLElement).textContent = customers.length.toString();
      this.customers = customers.slice(-5);
    });

    this.employeeService.getEmployees().subscribe(employees => {
      (document.getElementById('employees-number') as HTMLElement).textContent = employees.length.toString();
    });

    this.touristServicesServ.getTouristServices().subscribe(touristServices => {
      (document.getElementById('services-number') as HTMLElement).textContent = touristServices.length.toString();
    });

    this.saleService.getSales().subscribe(sales => {
      (document.getElementById('earnings-number') as HTMLElement).textContent = this.getEarnings(sales);
      this.sales = sales.slice(-5);
    });
  }

  private getEarnings(sales: SaleDetailsModel[]): string {
    const sum = sales.reduce((sum, value) => sum + value.price, 0);

    if(sum >= 1000 && sum < 1000000)
      return (sum / 1000).toFixed(1) + "K";

    if(sum >= 1000000 && sum < 1000000000)
      return (sum / 1000000).toFixed(1) + "M";

    if(sum >= 1000000000 && sum < 1000000000000)
      return (sum / 1000000000).toFixed(1) + "B";

    if(sum >= 1000000000000 && sum < 1000000000000000)
      return (sum / 1000000000000).toFixed(1) + "T";

    return sum.toFixed(1) + "K";
  }
}
