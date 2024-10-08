import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TypeDocument, Gender, JobRelationship } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { NewClientFormComponent } from '../../clients/new-client-form/new-client-form.component';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-codebtor-form',
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
  templateUrl: './new-codebtor-form.component.html',
  styleUrl: './new-codebtor-form.component.scss'
})
export class NewCodebtorFormComponent {
  codebtorForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);
  lisJobRelationShips: JobRelationship[] = [];
  isEditMode: boolean = false;
  codebtorData: any;  // Contendrá los datos del cliente si es modo edición


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewClientFormComponent>,
    private clientService: ClientService,
    private authService: AuthService,
    private dialog: MatDialog,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coDebtorService: CodebtorService,
    private snackBar: ToastrService,
  ) {
      this.isEditMode = !!data?.client;  // Verifica si hay datos de cliente para editar
      this.codebtorData = data?.client || {};  // Carga los datos del cliente o un objeto vacío

      this.codebtorForm = this.fb.group({
        first_name: [this.codebtorData.first_name || '', Validators.required],
        last_name: [this.codebtorData.last_name || '', Validators.required],
        type_document: [this.codebtorData.type_document || '', Validators.required],
        document_number: [this.codebtorData.document_number || '', Validators.required],
        email: [this.codebtorData.email || '', [Validators.required, Validators.email]],
        place_of_issue: [this.codebtorData.place_of_issue || '', Validators.required],
        gender: [this.codebtorData.gender || '', Validators.required],
        phone: [this.codebtorData.phone || '', Validators.required],
        mobile: [this.codebtorData.mobile || '', Validators.required],
        address: [this.codebtorData.address || '', Validators.required],
        neighborhood: [this.codebtorData.neighborhood || '', Validators.required],
        city: [this.codebtorData.city || '', Validators.required],
        office_phone: [this.codebtorData.office_phone || '', Validators.required],
        type_of_linkage: [this.codebtorData.type_of_linkage || '', Validators.required],
        sede: [this.codebtorData.sede || this.authService.getSedeUser(), Validators.required],
        job_relationship: [this.codebtorData.job_relationship?.id || '', Validators.required],
        observations: [this.codebtorData.observations || '']
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
      : '¿Está seguro de crear este codeudor?';

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.isEditMode){
            this.coDebtorService.updateCoDebtor(this.data.client?.id, this.codebtorForm.value).subscribe(resp => {
              this.snackBar.success(resp.message);
              this.dialogRef.close(true);
            }, error => {
              this.snackBar.error(error.error.error);
              console.error(error);
            });
        }
        else{
          this.coDebtorService.createCoDebtor(this.codebtorForm.value).subscribe(
            resp => {
              this.snackBar.success(resp.message);
              this.dialogRef.close(true);
            },
            error => {
              console.error(error.error.error);
              this.snackBar.error(error.error.error);
            }
          );
        }
      }
    });
  }

  onSubmit(): void { 
    if (this.codebtorForm.valid) {
      this.openConfirmDialog();  
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
