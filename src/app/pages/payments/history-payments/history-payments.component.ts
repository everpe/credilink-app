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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CreditService } from 'src/app/services/credits/credit.service';
import { ToastrService } from 'ngx-toastr';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  infoCredito: GetCreditDto;
  currentDate: Date = new Date();
  displayedColumnsStateCredit: string[] = ['concept', 'amount'];


  conceptsCredit: ConcepCredit[] = [];


  displayedColumns: string[] = [
    'paymentDate',
    'currentInterest',
    'capitalPayment',
    'interestPayment',
    // 'lateInterest',
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
    private creditService: CreditService,
    private snackbar: ToastrService
  ) {
    this.infoCredito = data.credit;
  }




  getPayments(): void {
    this.creditPaymentService.getCreditPayments(this.infoCredito.id).subscribe(
      (response: any) => {

        this.conceptsCredit = [
          { concept: 'Capital original del crédito', amount: Number(response.data.loan_amount) },
          { concept: 'Capital pendiente', amount: Number(response.data.remaining_balance) },
          { concept: 'Total de capital pagado', amount: Number(response.data.total_paid_capital) },
          { concept: 'Intereses pagados hasta la fecha', amount: Number(response.data.total_interest_paid) },
          { concept: 'Valor interés', amount: Number(this.infoCredito.interest_value) },
          { concept: 'Intereses acumulados pendientes', amount: Number(response.data.current_interest_debt) },
          // { concept: 'Interés moratorio aplicado', amount: Number(response.data.late_interest) },
          { concept: 'Total pagado hasta la fecha', amount: Number(response.data.total_paid) },
        ];
        
        this.historyPayments.data = response.data.payments.map((payment: any) => ({
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
        this.getCreditDetailById();
        this.getPayments();
      }
    });
  }


  getCreditDetailById(){
    this.creditService.getCreditDetails(this.infoCredito.id).subscribe( (resp:any) => {
      this.infoCredito = resp.data;

    },error=>{
      this.snackbar.error(error.error.error);
    });
  }


generatePDF(): void {
  const pdf = new jsPDF('p', 'pt', 'a4');

  // Agregar título
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text('KARDEX DIGITAL', pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text('Datos del Cliente y Detalles del Crédito:', 40, 60);

//una sola columna es esta tabla para juntar contenido
  const clientData = [
    [`Cliente: ${this.infoCredito.client.first_name?.toUpperCase()} ${this.infoCredito.client.last_name?.toUpperCase()}`],
    [`Identificación: ${this.infoCredito.client.document_number}`],
    [`Fecha inicio crédito: ${this.infoCredito.loan_date}`],
    [`Monto de crédito: ${Number(this.infoCredito.loan_amount).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`],
    [`Tasa de interés corriente: ${this.infoCredito.interest_rate}% mensual`],
    [`Fecha de emisión del reporte: ${new Date().toLocaleDateString()}`]
];
  autoTable(pdf, {
    body: clientData,
    startY: 80,
    theme: 'plain',
    styles: { 
      fontSize: 10, 
      cellPadding: 2 // Reduce el espacio interno de las celdas
    },
    columnStyles: {
      0: { halign: 'left' } // Alinea la única columna a la izquierda
    }
});

  // Agregar subtítulo para el estado del crédito
  const lastYClientTable = (pdf as any).lastAutoTable.finalY + 20;
  pdf.text('Estado Actual del Crédito:', 40, lastYClientTable);

  // Datos de la tabla de estado del crédito con formato de moneda
  const creditStatusData = this.conceptsCredit.map(item => [
    item.concept, 
     item.amount ? item.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '$ 0,00'
  ]);

  // Generar tabla para estado del crédito
  autoTable(pdf, {
      head: [['Concepto', 'Monto']],
      body: creditStatusData,
      startY: lastYClientTable + 10,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 85, 85], textColor: [255, 255, 255] },
  });

  // Historial de movimientos
  const lastYCreditStatusTable = (pdf as any).lastAutoTable.finalY + 20;
  pdf.text('Historial de Movimientos (Mensual):', 40, lastYCreditStatusTable);

  const movementData = this.historyPayments.data.map((payment: any) => [
      payment.paymentDate.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      payment.currentInterest.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      payment.capitalPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      payment.interestPayment.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      // payment.lateInterest.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      payment.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      payment.currentCapital.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      (payment.remainingCapital ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
  ]);

  autoTable(pdf, {
      head: [['Fecha abono', 'Interés Corriente', 'Abono a Capital', 'Abono a Interés',  'Pago Total', 'Capital actual', 'Capital pendiente']],
      body: movementData,
      startY: lastYCreditStatusTable + 20,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 85, 85], textColor: [255, 255, 255] },
  });

  // Abrir el PDF en una nueva pestaña
  pdf.output('dataurlnewwindow');
}


}
