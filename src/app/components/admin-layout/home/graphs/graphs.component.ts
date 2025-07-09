import { Component, inject, OnInit } from '@angular/core';
import Chart from "chart.js/auto";
import { AuthService, SaleService, SweetAlertService, ToastrNotificationService } from '../../../../services';

@Component({
  selector: 'app-graphs',
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.css'
})

export class GraphsComponent implements OnInit {
  protected chart!: Chart;
  private authService = inject(AuthService);
  private saleService = inject(SaleService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dataMonths: number[] = [];

  ngOnInit(): void {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        const jan = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 1 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const feb = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 2 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const march = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 3 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const april = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 4 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const may = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 5 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const june = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 6 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const july = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 7 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const august = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 8 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const sept = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 9 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const oct = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 10 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const nov = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 11 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;
        const dec = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 12 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).length;

        this.dataMonths = [jan, feb, march, april, may, june, july, august, sept, oct, nov, dec];
        this.getGraphByMonth(this.dataMonths);
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  private getGraphByMonth(dataMonth: number[]): void {
    const labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];
    const data = {
      labels: labels,
      datasets: [{
        label: '# sales per month',
        data: dataMonth,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }]
    };

    this.chart = new Chart("chart", {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    })
  }
}
