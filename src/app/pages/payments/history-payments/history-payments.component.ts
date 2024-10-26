import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaymentService } from 'src/app/services/payments/payment.service';

@Component({
  selector: 'app-history-payments',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './history-payments.component.html',
  styleUrl: './history-payments.component.scss'
})
export class HistoryPaymentsComponent implements AfterViewInit{
  startDate = '2024-10-01'; // Formato YYYY-MM-DD
  reportDate = '2024-10-06';

  displayedColumnsStateCredit: string[] = ['concept', 'amount'];

  // Datos de ejemplo para mostrar en la tabla
  creditData = [
    { concept: 'Capital original del crédito', amount: 1000000 },
    { concept: 'Capital pendiente', amount: 800000 },
    { concept: 'Total de capital pagado', amount: 200000 },
    { concept: 'Intereses pagados hasta la fecha', amount: 240100 },
    { concept: 'Intereses acumulados pendientes', amount: 40000 },
    { concept: 'Interés moratorio aplicado', amount: 3100 },
    { concept: 'Total pagado hasta la fecha', amount: 643100 },
  ];



  displayedColumns: string[] = ['paymentDate', 'interest', 'capitalPayment', 'interestPayment', 'lateInterest', 'totalPayment', 'currentCapital', 'remainingCapital'];
  movementData = new MatTableDataSource([
    { paymentDate: new Date('2024-10-02'), interest: 50000, capitalPayment: 0, interestPayment: 50000, lateInterest: 0, totalPayment: 50000, currentCapital: 1000000, remainingCapital: 1000000 },
    { paymentDate: new Date('2024-11-01'), interest: 50000, capitalPayment: 0, interestPayment: 50000, lateInterest: 0, totalPayment: 50000, currentCapital: 1000000, remainingCapital: 1000000 },
    { paymentDate: new Date('2024-12-01'), interest: 50000, capitalPayment: 0, interestPayment: 0, lateInterest: 0, totalPayment: 0, currentCapital: 1000000, remainingCapital: 1000000 },
    { paymentDate: new Date('2025-01-01'), interest: 100000, capitalPayment: 0, interestPayment: 0, lateInterest: 3100, totalPayment: 103100, currentCapital: 1000000, remainingCapital: 1000000 },
    { paymentDate: new Date('2025-02-01'), interest: 50000, capitalPayment: 0, interestPayment: 100000, lateInterest: 3100, totalPayment: 103100, currentCapital: 1000000, remainingCapital: 1000000 },
    { paymentDate: new Date('2025-03-01'), interest: 40000, capitalPayment: 200000, interestPayment: 40000, lateInterest: 0, totalPayment: 240000, currentCapital: 1000000, remainingCapital: 800000 },
  ]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngAfterViewInit() {
    this.movementData.paginator = this.paginator;
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos pasados al modal
    private creditPaymentService: PaymentService
  ) { }
}
