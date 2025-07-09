import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../shared";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from "@angular/cdk/layout";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-customer-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    NgClass
  ],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})

export default class CustomerLayoutComponent implements AfterViewInit {
  protected sidebarStatus: boolean = true;
  protected options = [
    {
      name: 'Home',
      icon: 'fa-solid fa-home',
      link: '/home/dashboard'
    },
    {
      name: 'Buy service',
      icon: 'fa-solid fa-cart-plus',
      link: '/home/buyService'
    },
    {
      name: 'Buy package',
      icon: 'fa-solid fa-cart-flatbed',
      link: '/home/buyPackage'
    },
    {
      name: 'Purchases',
      icon: 'fa-solid fa-plane',
      link: '/home/purchases'
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
