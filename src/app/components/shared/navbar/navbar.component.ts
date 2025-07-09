import { Component, inject, Input } from '@angular/core';
import { AuthService, SweetAlertService } from '../../../services';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIf,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  @Input() sidenav?: MatSidenav;
  private authService = inject(AuthService);
  private router = inject(Router);
  protected currentUser = this.authService.getUser();
  private sweetAlertService = inject(SweetAlertService);

  protected seeProfile(): void {
    if(this.currentUser.role === 'ROLE_ADMIN')
      this.router.navigate(['/admin/home/profile']);
    else if(this.currentUser.role === 'ROLE_CUSTOMER')
      this.router.navigate(['/home/dashboard/profile']);
    else if(this.currentUser.role === 'ROLE_EMPLOYEE')
      this.router.navigate(['/employee/dashboard/profile']);
  }

  protected logout(): void {
    this.sweetAlertService.logoutPopUp('Logging out...', 1500, this.authService);
  }
}
