import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-notification',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-notification.component.html',
  styleUrl: './confirm-notification.component.scss'
})
export class ConfirmNotificationComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  // Se ejecuta al presionar "No": cierra el modal devolviendo "false"
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Se ejecuta al presionar "Si": cierra el modal devolviendo "true"
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
