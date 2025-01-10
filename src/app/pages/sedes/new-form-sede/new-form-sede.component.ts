import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { TypeDocument } from 'src/app/interfaces/client.interface';
import { CompanyMinDto } from 'src/app/interfaces/company.interface';
import { CreateSedeDto } from 'src/app/interfaces/sede.interface';
import { CompanyService } from 'src/app/services/companies/company.service';
import { SedeService } from 'src/app/services/sedes/sede.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

@Component({
  selector: 'app-new-form-sede',
  standalone: true,
  imports: [    
      FormsModule,
      CommonModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatIconModule,
      MatDialogModule,
      MatDatepickerModule,
      MatCheckboxModule,
      MatAutocompleteModule,
      MatOptionModule	
    ],
  templateUrl: './new-form-sede.component.html',
  styleUrl: './new-form-sede.component.scss'
})
export class NewFormSedeComponent {
  sedeForm: FormGroup;
  isEditMode: boolean = false;
  sedeDataEdit: any;
  documentTypes = Object.values(TypeDocument);
  companies: CompanyMinDto[] = [];
  filteredCompanies = [...this.companies];

  constructor(
    private fb: FormBuilder,
    private sedeService: SedeService,
    private dialog: MatDialog,
    private snackBar: ToastrService,
    private dialogRef: MatDialogRef<NewFormSedeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyService: CompanyService
  ) {
    this.isEditMode = data?.isEditMode; // Determina si está en modo edición
    this.sedeDataEdit = data?.sede || null;

    this.sedeForm = this.fb.group({
      name: [this.sedeDataEdit?.name || '', [Validators.required, Validators.maxLength(70)]],
      responsible_name: [this.sedeDataEdit?.responsible_name || '', [Validators.required, Validators.maxLength(70)]],
      surnames_responsible: [this.sedeDataEdit?.surnames_responsible || '', [Validators.required, Validators.maxLength(70)]],
      company: [this.sedeDataEdit?.company || null, [Validators.required]], // ID de la compañía
      rut: [this.sedeDataEdit?.rut || '', [Validators.required, Validators.maxLength(15)]],
      corporate_email: [this.sedeDataEdit?.corporate_email || '', [Validators.required, Validators.email]],
      city: [this.sedeDataEdit?.city || '', [Validators.required, Validators.maxLength(70)]],
      address: [this.sedeDataEdit?.address || '', [Validators.required, Validators.maxLength(70)]],
      coporative_phone: [this.sedeDataEdit?.coporative_phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      type_of_responsible_document: [this.sedeDataEdit?.type_of_responsible_document || '', [Validators.required]],
      responsible_phone: [this.sedeDataEdit?.responsible_phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      responsible_email: [this.sedeDataEdit?.responsible_email || '', [Validators.required, Validators.email]],
      send_notifications: [this.sedeDataEdit?.send_notifications || false],
    });
    // console.log( data?.sede);
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompaniesMin().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Error al obtener las compañías:', err);
      },
    });
  }
  onSubmit(): void {
    var sedeValue = this.sedeForm.value;
    sedeValue.company = this.sedeForm.value.company.id;
    console.log(sedeValue);

    this.sedeForm.markAllAsTouched();

    if (this.sedeForm.valid) {
      const message = this.isEditMode
        ? '¿Está seguro de los cambios?'
        : '¿Está seguro de crear esta sede?';

      const dialogRefConfirm = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: { message },
      });

      dialogRefConfirm.afterClosed().subscribe((result) => {
        if (result) {
          if (this.isEditMode) {
            this.sedeService.updateSede(this.data?.sede?.id, sedeValue).subscribe({
              next: () => {
                this.dialogRef.close(true);
                this.snackBar.success('Sede actualizada exitosamente.');
              },
              error: (err) => {
                console.error('Error al actualizar la sede:', err);
                this.snackBar.error(err.error.error);
              },
            });
          } else {
            this.sedeService.createSede(sedeValue).subscribe({
              next: () => {
                this.dialogRef.close(true);
                this.snackBar.success('Sede creada exitosamente.');
              },
              error: (err) => {
                console.error('Error al crear la sede:', err);
                this.snackBar.error(err.error.error);
              },
            });
          }
        }
      });
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    KeyPressOnlyNumbersValidator(event);
  }


   /**
   * Filtra las compañías en base al texto ingresado por el usuario.
   * @param event Evento de entrada del usuario.
   */
   filterCompanies(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCompanies = this.companies.filter((company) =>
      company.company_name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Devuelve el nombre de la compañía para mostrar en el campo cuando se selecciona.
   * @param company Objeto de compañía seleccionado.
   */
  displayCompany(company: any): string {
    return company && company.company_name ? company.company_name : '';
  }

    /**
   * Muestra registros por defecto al hacer foco en el campo.
   */
    showDefaultCompanies(): void {
      this.filteredCompanies = [...this.companies.slice(0, 10)];
    }
  
}
