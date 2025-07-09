import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TouristServiceModel } from '../../../../models';
import { TouristServicesService } from '../../../../services';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-details',
  imports: [
    MatDialogContent,
    MatIcon,
    MatTooltip,
    RouterLink
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})

export class ServiceDetailsComponent {
  protected data = inject<TouristServiceModel>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ServiceDetailsComponent>);
  private touristServiceServ = inject(TouristServicesService);

  protected closeDetails(): void {
    this.dialogRef.close(true);
  }

  protected getServiceImage(): any {
    return this.touristServiceServ.getTouristServiceImageById(this.data.id);
  }
}
