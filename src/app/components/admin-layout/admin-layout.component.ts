import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../shared";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from "@angular/cdk/layout";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    NgClass
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})

export default class AdminLayoutComponent implements AfterViewInit {
  protected sidebarStatus: boolean = true;
  protected options = [
    {
      name: 'Home',
      icon: 'fa-solid fa-home',
      link: '/admin/home'
    },
    {
      name: 'Customers',
      icon: 'fa-solid fa-user',
      link: '/admin/customers'
    },
    {
      name: 'Employees',
      icon: 'fa-solid fa-users-rays',
      link: '/admin/employees'
    },
    {
      name: 'Services',
      icon: 'fa-solid fa-plane',
      link: '/admin/services'
    },
    {
      name: 'Payment methods',
      icon: 'fa-solid fa-money-check-dollar',
      link: '/admin/paymentMethods'
    }
  ];
  private observer = inject(BreakpointObserver);

  @ViewChild(MatSidenav)
  protected sidenav!: MatSidenav;
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 1000px)']).subscribe(res => {
      if(res.matches) {
        this.sidebarStatus = false;
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }
      else {
        this.sidebarStatus = true;
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    })

    this.cdr.detectChanges();
  }
}
