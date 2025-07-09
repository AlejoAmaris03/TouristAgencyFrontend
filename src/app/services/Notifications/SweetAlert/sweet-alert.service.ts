import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { AuthService } from '../../AuthService';

@Injectable({
  providedIn: 'root'
})

export class SweetAlertService {
  public reloadPage(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.reload();
    });
  }

  public logoutPopUp(title: string, time: number, authService: AuthService): void {
    let timerInterval: any;

    Swal.fire({
      title: title,
      timer: time,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then(() => {
      authService.logout();
      window.location.reload();
    });
  }

  public logoutAfteUpdate(title: string, message: string, authService: AuthService) {
    Swal.fire({
      title: title,
      text: message,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    }).then(() => {
      authService.logout();
      window.location.reload();
    });
  }
}
