import { inject, Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})

export class ToastrNotificationService {
  private toastrService = inject(ToastrService);

  public showSuccess(message: string, title: string): void {
    this.toastrService.success(message, title);
  }

  public showError(message: string, title: string): void {
    this.toastrService.error(message, title);
  }

  public showWarning(message: string, title: string): void {
    this.toastrService.warning(message, title);
  }

  public clearToastr(): void {
    this.toastrService.clear();
  }
}
