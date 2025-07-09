import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SaleDetailsModel } from '../../../../models';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-see-details',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    MatTooltip,
    NgIf,
    NgFor
  ],
  templateUrl: './see-details.component.html',
  styleUrl: './see-details.component.css'
})

export class SeeDetailsComponent {
  protected purchaseDetails = inject<SaleDetailsModel>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SeeDetailsComponent>);

  protected closeDetailsDialog(): void {
    this.dialogRef.close(true);
  }

  protected parseDate(dateString: string): string {
    const [dateYear, dateMonth, dateDay] = dateString.split('-').map(Number);
    const date = new Date(dateYear, dateMonth - 1, dateDay);
    const day = date.getDate();
    const month = date.toLocaleDateString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}
