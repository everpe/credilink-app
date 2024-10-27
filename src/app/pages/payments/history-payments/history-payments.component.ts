import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConcepCredit, GetCreditDto } from 'src/app/interfaces/credit.interface';
import { PaymentDto } from 'src/app/interfaces/payment.interface';
import { PaymentService } from 'src/app/services/payments/payment.service';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';

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
export class HistoryPaymentsComponent implements OnInit, AfterViewInit {
  infoCredito: GetCreditDto;
  currentDate: Date = new Date();
  displayedColumnsStateCredit: string[] = ['concept', 'amount'];


  conceptsCredit: ConcepCredit[] = [];



  payments: PaymentDto[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'paymentDate',
    'currentInterest',
    'capitalPayment',
    'interestPayment',
    'lateInterest',
    'amount',
    'currentCapital',
    'pendingCapital'
  ];




  historyPayments = new MatTableDataSource<PaymentDto>([]);



  ngAfterViewInit() {
    this.historyPayments.paginator = this.paginator;
  }

  ngOnInit() {
    this.getPayments();

  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos pasados al modal
    private creditPaymentService: PaymentService,
    private dialog: MatDialog,
  ) {
    this.infoCredito = data.credit;
  }




  getPayments(): void {
    this.creditPaymentService.getCreditPayments(this.infoCredito.id).subscribe(
      (response: any) => {

        this.conceptsCredit = [
          { concept: 'Capital original del crédito', amount: response.data.loan_amount },
          { concept: 'Capital pendiente', amount: response.data.remaining_balance },
          { concept: 'Total de capital pagado', amount: response.data.total_paid_capital },
          { concept: 'Intereses pagados hasta la fecha', amount: response.data.total_interest_paid },
          { concept: 'Intereses acumulados pendientes', amount: response.data.current_interest_debt },
          { concept: 'Interés moratorio aplicado', amount: response.data.late_interest },
          { concept: 'Total pagado hasta la fecha', amount: response.data.total_paid },
        ];

        this.payments = response.data.payments.map((payment: any) => ({
          id: payment.id,
          type: payment.type,
          paymentType: payment.payment_type,
          credit: payment.credit,
          amount: parseFloat(payment.amount),
          paymentDate: new Date(payment.payment_date.split('/').reverse().join('-')),
          interestPayment: parseFloat(payment.interest_payment),
          capitalPayment: parseFloat(payment.capital_payment),
          lateInterest: parseFloat(payment.late_interest),
          currentCapital: parseFloat(payment.current_capital),
          remainingCapital: parseFloat(payment.pendient_capital),
          currentInterest: parseFloat(payment.current_interest)
        }));

        this.historyPayments.data = this.payments;
      },
      (error) => {
        console.error('Error al obtener los pagos', error);
      }
    );
  }



  createAbono(){
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      width: '900px', // Ajusta el ancho del modal si es necesario
      data: { 
        clienteId: this.infoCredito.id,
        capitalPendiente: this.infoCredito.remaining_balance,
        interesAcumuladoPediente: this.infoCredito.current_interest_debt,
        interesMoratorioPendiente : 0
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPayments();
      }
    });

  }
}
