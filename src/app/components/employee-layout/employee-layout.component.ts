import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../shared";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from "@angular/cdk/layout";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-employee-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    NgClass
  ],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})

export default class EmployeeLayoutComponent implements AfterViewInit {
  protected sidebarStatus: boolean = true;
  protected options = [
    {
      name: 'Home',
      icon: 'fa-solid fa-home',
      link: '/employee/dashboard'
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
