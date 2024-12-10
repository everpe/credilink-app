import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CompanyDto } from 'src/app/interfaces/company.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/companies/company.service';
import { debounceTime } from 'rxjs';
import { NewFormCompanyComponent } from './new-form-company/new-form-company.component';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit {
  companies = new MatTableDataSource<CompanyDto>([]);
  displayedColumns: string[] = [
    'actions',
    'social_reason',
    'rut',
    'fiscal_address',
    'representative',
    'document_number',
    'business_phone',
    'cellphone',
    'email',
    'number_of_locations',
    'company_name',
    'status',
  ];
  search = new FormControl('');
  totalUsers = 0;
  limit = 10;
  offset = 0;
  sede = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private companyService: CompanyService,
              private dialog: MatDialog,
              private snackBar: ToastrService,
              private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    
    this.sede = Number(this.authService.getSedeUser())
    
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.loadCompanies();
      });
  }


  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies.data = data;
        this.companies.paginator = this.paginator; 
      },
      error: (err) => {
        console.error('Error al cargar empresas:', err);
      }
    });
  }

  
  openNewCompanyDialog(): void {
    const dialogRef = this.dialog.open(NewFormCompanyComponent, {
      width: '700px',
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies(); 
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  editCompany(company: CompanyDto): void {
    const dialogRef = this.dialog.open(NewFormCompanyComponent, {
      width: '750px',
      data: { company: company, isEditMode: true },  
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.loadCompanies();  
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  deleteCompany(company: CompanyDto): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar este usuario: ${company.social_reason.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companyService.deleteCompanyById(company.id).subscribe(
          (resp:any) => {
            this.snackBar.success(resp.message);
            this.loadCompanies(); 
        }, 
        (error:any) => {
          this.snackBar.error(error.error.error);
          console.error(error);
        });;
      }
    });
  }
}
