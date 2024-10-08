import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { CoDebtor } from 'src/app/interfaces/co-debtor';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule, 
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule 
  ],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent implements OnInit {
  creditForm: FormGroup;
  filteredClients: Observable<any[]> = of([]);  // Simulación de clientes filtrados
  filteredCoDebtors: Observable<CoDebtor[]> = of([]);
  constructor(private fb: FormBuilder) {
    this.creditForm = this.fb.group({
      clientDocument: ['', Validators.required],
      clientName: ['', Validators.required],
      coDebtorDocument: ['', Validators.required],
      coDebtorName: ['', Validators.required],
      coDebtorCompany: [''],
      coDebtorPhone: [''],
      loanDate: ['', Validators.required],
      loanAmount: ['', Validators.required],
      loanInstallments: ['', Validators.required],
      comments: [''],
    });
  }

  ngOnInit(): void {
    // Lógica para obtener la lista de clientes y codeudores
  }

  onSubmit() {
    if (this.creditForm.valid) {
      // Aquí procesarías la creación del préstamo
      console.log(this.creditForm.value);
    }
  }
}
