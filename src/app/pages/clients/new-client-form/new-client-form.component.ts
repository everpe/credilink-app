import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Gender, JobRelationship, TypeDocument } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-new-client-form',
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
      MatError
    ],
  templateUrl: './new-client-form.component.html',
  styleUrl: './new-client-form.component.scss'
})
export class NewClientFormComponent implements OnInit{
  clientForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);
  lisJobRelationShips: JobRelationship[] = [];
  isEditMode: boolean = false;
  clientData: any;  // Contendrá los datos del cliente si es modo edición

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewClientFormComponent>,
    private clientService: ClientService,
    private authService: AuthService,
    private dialog: MatDialog,  
    @Inject(MAT_DIALOG_DATA) public data: any,  // Usado para pasar datos desde el componente padre
    private snackBar: ToastrService,
  ) {
      this.isEditMode = !!data?.client;  // Verifica si hay datos de cliente para editar
      this.clientData = data?.client || {};  // Carga los datos del cliente o un objeto vacío

      this.clientForm = this.fb.group({
        first_name: [this.clientData.first_name || '', Validators.required],
        last_name: [this.clientData.last_name || '', Validators.required],
        type_document: [this.clientData.type_document || '', Validators.required],
        document_number: [this.clientData.document_number || '', Validators.required],
        email: [this.clientData.email || '', [Validators.required, Validators.email]],
        place_of_issue: [this.clientData.place_of_issue || '', Validators.required],
        gender: [this.clientData.gender || '', Validators.required],
        phone: [this.clientData.phone || '', Validators.required],
        mobile: [this.clientData.mobile || '', Validators.required],
        address: [this.clientData.address || '', Validators.required],
        neighborhood: [this.clientData.neighborhood || '', Validators.required],
        city: [this.clientData.city || '', Validators.required],
        office_phone: [this.clientData.office_phone || '', Validators.required],
        type_of_linkage: [this.clientData.type_of_linkage || '', Validators.required],
        sede: [this.clientData.sede || this.authService.getSedeUser(), Validators.required],
        job_relationship: [this.clientData.job_relationship?.id || '', Validators.required],
        observations: [this.clientData.observations || '']
      });
  }

  ngOnInit(): void {
    this.clientService.getJobRelationships(1).subscribe(
      (data: JobRelationship[]) => {
        this.lisJobRelationShips = data;
      },
      (error) => {
        console.error('Error fetching job relationships:', error);
      }
    );
  }

  openConfirmDialog(): void {
    const message = this.isEditMode
      ? '¿Está seguro de los cambios?'
      : '¿Está seguro de crear este cliente?';

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if( this.isEditMode) {
            this.clientService.updateClient(this.data.client.id, this.clientForm.value).subscribe(resp => {
            this.snackBar.success(resp.message);
            this.dialogRef.close(true);
          }, error => {
            this.snackBar.error(error.error.error);
            console.error(error);
          });

        }else{
          this.clientService.createClient(this.clientForm.value).subscribe(
            resp => {
              this.snackBar.success(resp.message);
              this.dialogRef.close(true);
            },
            error => {
              console.error(error);
              this.snackBar.error(error.error.error);
            }
          );
        }
      }
    });
  }

  onSubmit(): void { 
    if (this.clientForm.valid) {
      this.openConfirmDialog();  
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
