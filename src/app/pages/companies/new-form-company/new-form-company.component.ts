import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { TypeDocument } from 'src/app/interfaces/client.interface';
import { CompanyDto } from 'src/app/interfaces/company.interface';
import { CompanyService } from 'src/app/services/companies/company.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

@Component({
  selector: 'app-new-form-company',
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
    MatDatepickerModule	
  ],
  templateUrl: './new-form-company.component.html',
  styleUrl: './new-form-company.component.scss'
})
export class NewFormCompanyComponent implements OnInit {
  companyForm: FormGroup;
  isEditMode: boolean = false;
  companyDataEdit: CompanyDto;
  documentTypes = Object.values(TypeDocument);
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialog: MatDialog,
    private snackBar: ToastrService,
    private dialogRef: MatDialogRef<NewFormCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data?.isEditMode; // Determina si está en modo edición
    this.companyDataEdit = data?.company || null;

    // Inicializa el formulario
    this.companyForm = this.fb.group({
      social_reason: [this.companyDataEdit?.social_reason || '', [Validators.required, Validators.maxLength(100)]],
      rut: [this.companyDataEdit?.rut || '', [Validators.required, Validators.maxLength(15)]],
      fiscal_address: [this.companyDataEdit?.fiscal_address || '', [Validators.required, Validators.maxLength(255)]],
      representative_first_name: [this.companyDataEdit?.representative_first_name || '', [Validators.required, Validators.maxLength(50)]],
      representative_last_name: [this.companyDataEdit?.representative_last_name || '', [Validators.required, Validators.maxLength(50)]],
      type_document: [this.companyDataEdit?.type_document || '', Validators.required],
      document_number: [this.companyDataEdit?.document_number || '', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      business_phone: [this.companyDataEdit?.business_phone || '',  [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      cellphone: [this.companyDataEdit?.cellphone || '',  [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      email: [this.companyDataEdit?.email || '', [Validators.required, Validators.email]],
      number_of_locations: [this.companyDataEdit?.number_of_locations || 1, [Validators.required, Validators.min(1)]],
      company_name: [this.companyDataEdit?.company_name || '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const companyValue = this.companyForm.value;
    this.companyForm.markAllAsTouched();

    if (this.companyForm.valid) {
      const message = this.isEditMode
        ? '¿Está seguro de los cambios?'
        : '¿Está seguro de crear esta compañía?';

      const dialogRefConfirm = this.dialog.open(ConfirmComponent, {
        width: '400px',
        data: { message },
      });

      dialogRefConfirm.afterClosed().subscribe((result) => {
        if (result) {
          if (this.isEditMode) {
            this.companyService.updateCompany(this.data?.company?.id, companyValue).subscribe({
              next: () => {
                this.dialogRef.close(true);
                this.snackBar.success('Compañía actualizada exitosamente.');
              },
              error: (err:any) => {
                console.error('Error al actualizar la compañía:', err);
                this.snackBar.error(err.error.error);
              },
            });
          } else {
            this.companyService.createCompany(companyValue).subscribe({
              next: (response) => {
                this.dialogRef.close(true);
                this.snackBar.success('Compañía creada exitosamente.');
              },
              error: (err) => {
                console.error('Error al crear la compañía:', err);
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
}