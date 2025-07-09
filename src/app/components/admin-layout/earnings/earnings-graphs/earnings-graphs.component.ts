import { Component, inject, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import Chart from "chart.js/auto";
import { AuthService, SaleService, SweetAlertService, ToastrNotificationService } from '../../../../services';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-earnings-graphs',
  imports: [
    MatDialogContent, 
    MatDialogActions,
    MatDialogModule,
    MatTooltip,
    MatChipsModule,
    MatIcon
  ],
  templateUrl: './earnings-graphs.component.html',
  styleUrl: './earnings-graphs.component.css'
})

export class EarningsGraphsComponent implements OnInit {
  protected chart!: Chart;
  protected total!: number;
  private authService = inject(AuthService);
  private saleService = inject(SaleService);
  private sweetAlertService = inject(SweetAlertService);
  private toastrService = inject(ToastrNotificationService);
  private dataMonths: number[] = [];
  private dialog = inject(MatDialogRef<EarningsGraphsComponent>);
  private chartData!: any;
  private labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        const jan = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 1 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const feb = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 2 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const march = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 3 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const april = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 4 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const may = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 5 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const june = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 6 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);
        const july = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 7 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;
        const august = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 8 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;
        const sept = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 9 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;
        const oct = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 10 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;
        const nov = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 11 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;
        const dec = sales.filter(s => Number(s.dateOfSale.toString().split('-')[1]) === 12 && 
          Number(s.dateOfSale.toString().split('-')[0]) === new Date().getFullYear()).reduce((sum, s) => sum + s.price, 0);;

        this.dataMonths = [jan, feb, march, april, may, june, july, august, sept, oct, nov, dec];
        this.total = sales.reduce((sum, el) => sum + el.price, 0);
        this.fillGraph();
        this.graphToBar();
      },
      error: () => {
        if (!this.authService.isAuthenticated())
          this.sweetAlertService.reloadPage('Attention!', 'Your session has expired. Try to login again!');
        else
          this.toastrService.showError('Something went wrong', 'Error');
      }
    });
  }

  protected graphToBar(): void {    
    if(this.chart)
      this.chart.destroy();
    
    this.chart = new Chart("chart", {
      type: 'bar',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  protected graphToLine(): void {    
    if(this.chart)
      this.chart.destroy();
    
    this.chart = new Chart("chart", {
      type: 'line',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  protected graphToCircle() {
    if(this.chart)
      this.chart.destroy();

    this.chart = new Chart("chart", {
      type: 'doughnut',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  protected graphToPie() {
    if(this.chart)
      this.chart.destroy();

    this.chart = new Chart("chart", {
      type: 'pie',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }
  
  protected closeDialog(): void {
    this.dialog.close(true);
  }

  private fillGraph() {
    this.chartData = {
      labels: this.labels,
      datasets: [{
        label: '# earnings per month',
        data: this.dataMonths,
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
  }
}