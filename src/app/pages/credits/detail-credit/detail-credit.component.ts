import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';

@Component({
  selector: 'app-detail-credit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatError,
    MatDialogModule
  ],
  templateUrl: './detail-credit.component.html',
  styleUrl: './detail-credit.component.scss'
})
export class DetailCreditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public credit: GetCreditDto) {}
}
