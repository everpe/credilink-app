import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { GetCreditDto } from 'src/app/interfaces/credit.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { CreditService } from 'src/app/services/credits/credit.service';

@Component({
  selector: 'list-credits',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent  implements OnInit {

  displayedColumns: string[] = ['client', 'co_debtor', 'loan_date', 'reminder_date', 'loan_amount', 'interest_rate', 'number_of_installments', 'loan_status', 'interest_value', 'total_debt', 'remaining_balance', 'next_payment_date'];
  dataSource = new MatTableDataSource<GetCreditDto>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;





  constructor(private formBuilder: FormBuilder,
    private clientService: ClientService,
    private codebtorService: CodebtorService,
    private authService: AuthService,
    private creditService: CreditService,
    private snackBar: ToastrService,
  ) { }
  ngOnInit(): void {
    this.loadCredits();
  }

  credits: GetCreditDto[] = [];


  loadCredits(): void {
    this.creditService.getCredits(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: GetCreditDto[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator; // Asignar el paginador
      },
      error => {
        console.error('Error al cargar créditos', error);
      }
    );
  }
}
