import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaymentDto } from 'src/app/interfaces/payment.interface';
import { PaymentService } from 'src/app/services/payments/payment.service';

@Component({
  selector: 'app-payments-credit-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './payments-credit-list.component.html',
  styleUrl: './payments-credit-list.component.scss'
})
export class PaymentsCreditListComponent implements OnInit {

  dataSource = new MatTableDataSource<PaymentDto>([]);
  creditId: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos pasados al modal
    private creditPaymentService: PaymentService
  ) {
    this.creditId = data.creditId; // Obtenemos el ID del crédito desde los datos pasados al modal
  }

  ngOnInit(): void {
    this.getPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  // Conectar la tabla al paginador
  }
  // Método para obtener los pagos de un crédito
  getPayments(): void {
    this.creditPaymentService.getCreditPayments(this.creditId).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.payments as PaymentDto[];
      },
      (error) => {
        console.error('Error al obtener los pagos', error);
      }
    );
  }
}