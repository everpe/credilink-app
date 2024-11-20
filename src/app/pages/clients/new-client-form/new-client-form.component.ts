import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Gender, JobRelationship, TypeDocument, TypeLinkage } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

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
    MatError,
    MatIconModule,
  ],
  templateUrl: './new-client-form.component.html',
  styleUrl: './new-client-form.component.scss'
})
export class NewClientFormComponent implements OnInit {
  @ViewChild('jobRelationshipSelect') jobRelationshipSelect!: MatSelect;
  @ViewChild('typeLinkageSelect') typeLinkageSelect!: MatSelect;
  clientForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);
  lisJobRelationShips: JobRelationship[] = [];
  lisTypeLinkages: TypeLinkage[] = [];
  addingNewRelationship = false; // Controla si se está agregando un nueva RL
  addingNewLinkage = false; // Controla si se está agregando TipoVinculacion
  isEditMode: boolean = false;
  clientData: any;  // Contendrá los datos del cliente si es modo edición

  newRelationshipNameControl = new FormControl('', [Validators.required, Validators.maxLength(70)]);
  newLinkageNameControl = new FormControl('', [Validators.required, Validators.maxLength(70)]);

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
      first_name: [this.clientData.first_name || '', [Validators.required, Validators.maxLength(70)]],
      last_name: [this.clientData.last_name || '', [Validators.required, Validators.maxLength(70)]],
      type_document: [this.clientData.type_document || '', Validators.required],
      document_number: [
        this.clientData.document_number || '', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      email: [this.clientData.email || '', [ Validators.email]],
      place_of_issue: [this.clientData.place_of_issue || '', [Validators.required, Validators.maxLength(70)]],
      gender: [this.clientData.gender || '', Validators.required],
      phone: [this.clientData.phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      mobile: [this.clientData.mobile || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [this.clientData.address || '', [Validators.required, Validators.maxLength(70)]],
      neighborhood: [this.clientData.neighborhood || '', [Validators.required, Validators.maxLength(70)]],
      city: [this.clientData.city || '', [Validators.required, Validators.maxLength(70)]],
      office_phone: [this.clientData.office_phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      type_linkage: [this.clientData.type_linkage?.id || '', Validators.required],
      sede: [this.clientData.sede || this.authService.getSedeUser(), Validators.required],
      job_relationship: [this.clientData.job_relationship?.id || '', Validators.required],
      observations: [this.clientData.observations || '', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.clientService.getJobRelationships(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: JobRelationship[]) => {
        this.lisJobRelationShips = data;
      },
      (error) => {
        console.error('Error fetching job relationships:', error);
      }
    );
    this.clientService.getTypesLinkages(Number(this.authService.getSedeUser()) ?? 0).subscribe(
      (data: TypeLinkage[]) => {
        this.lisTypeLinkages = data;
      },
      (error) => {
        console.error('Error fetching type_lynkages:', error);
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

        if (this.isEditMode) {
          this.clientService.updateClient(this.data.client.id, this.clientForm.value).subscribe(resp => {
            this.snackBar.success(resp.message);
            this.dialogRef.close(true);
          }, error => {
            this.snackBar.error(error.error.error);
            console.error(error);
          });

        } else {
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




// Relacion Trabajo
   toggleAddNewRelationship(): void {
    this.addingNewRelationship = true;
    this.newRelationshipNameControl?.reset('');
  }

  saveNewRelationship(): void {
    if (this.newRelationshipNameControl?.valid) {

      this.clientService.addJobRelationship(Number(this.authService.getSedeUser()), this.newRelationshipNameControl?.value ?? '')
        .subscribe( response =>{
          this.lisJobRelationShips.push(response.data);
          this.clientForm.get('job_relationship')?.setValue(response.data.id);
         this.jobRelationshipSelect.close();

        }, error=>{
          this.snackBar.error(error.error.error);
        });

      this.addingNewRelationship = false;
      this.newRelationshipNameControl?.reset();
    }else{
      this.newRelationshipNameControl?.markAsTouched()
    }
  }

  cancelAddNewRelationship(): void {
    this.addingNewRelationship = false;
    this.newRelationshipNameControl?.reset();
  }



  //Tipos  Vinculacion
  toggleAddNewLinkage() {
    this.addingNewLinkage = !this.addingNewLinkage;
    if (!this.addingNewLinkage) {
      this.newLinkageNameControl?.reset();
    }
  }

  saveNewLinkage() {
    if (this.newLinkageNameControl?.valid) {
      this.clientService.addTypeOfLink( Number(this.authService.getSedeUser()) ?? 0, this.newLinkageNameControl?.value ??  '')
      .subscribe( response => {
        this.lisTypeLinkages.push(response.data);
        this.clientForm.get('type_linkage')?.setValue(response.data.id);
        this.typeLinkageSelect.close();
      },error => {
        this.snackBar.error(error.error.error)
      });
      this.addingNewLinkage = false;
      this.newLinkageNameControl?.reset();
    } else {
      this.newLinkageNameControl?.markAsTouched();
    }
  }

  cancelAddNewLinkage() {
    this.addingNewLinkage = false;
    this.newLinkageNameControl?.reset();
  }


  handleKeyPress(event: KeyboardEvent): void {
    KeyPressOnlyNumbersValidator(event);
  }
  
}
