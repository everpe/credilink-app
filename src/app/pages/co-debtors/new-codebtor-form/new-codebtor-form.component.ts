import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TypeDocument, Gender, JobRelationship, TypeLinkage } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { NewClientFormComponent } from '../../clients/new-client-form/new-client-form.component';
import { CodebtorService } from 'src/app/services/codebtors/codebtor.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

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
    MatError,
    MatIconModule
  ],
  templateUrl: './new-codebtor-form.component.html',
  styleUrl: './new-codebtor-form.component.scss'
})
export class NewCodebtorFormComponent {
  @ViewChild('jobRelationshipSelect') jobRelationshipSelect!: MatSelect;
  @ViewChild('typeLinkageSelect') typeLinkageSelect!: MatSelect;
  codebtorForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);
  lisJobRelationShips: JobRelationship[] = [];
  lisTypeLinkages: TypeLinkage[] = [];
  addingNewRelationship = false; // Controla si se está agregando un nueva RL
  addingNewLinkage = false; // Controla si se está agregando TipoVinculacion
  isEditMode: boolean = false;
  codebtorData: any;  // Contendrá los datos del cliente si es modo edición

  newRelationshipNameControl = new FormControl('', [Validators.required, Validators.maxLength(70)]);
  newLinkageNameControl = new FormControl('', [Validators.required, Validators.maxLength(70)]);
  
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
        first_name: [this.codebtorData.first_name || '', [Validators.required, Validators.maxLength(70)]],
        last_name: [this.codebtorData.last_name || '', [Validators.required, Validators.maxLength(70)]],
        type_document: [this.codebtorData.type_document || '', Validators.required],
        document_number: [
          this.codebtorData.document_number || '', 
          [Validators.required, Validators.pattern('^[0-9]{8,10}$')]
        ],
        email: [this.codebtorData.email || '', [ Validators.email]],
        place_of_issue: [this.codebtorData.place_of_issue || '',[Validators.required, Validators.maxLength(70)]],
        gender: [this.codebtorData.gender || '', Validators.required],
        phone: [this.codebtorData.phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
        mobile: [this.codebtorData.mobile || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: [this.codebtorData.address || '', [Validators.required, Validators.maxLength(70)]],
        neighborhood: [this.codebtorData.neighborhood || '', [Validators.required, Validators.maxLength(70)]],
        city: [this.codebtorData.city || '', [Validators.required, Validators.maxLength(70)]],
        office_phone: [this.codebtorData.office_phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
        type_linkage: [this.codebtorData.type_linkage?.id || '', Validators.required],
        sede: [this.codebtorData.sede || this.authService.getSedeUser(), Validators.required],
        job_relationship: [this.codebtorData.job_relationship?.id || '', Validators.required],
        observations: [this.codebtorData.observations || '', Validators.maxLength(255)]
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
          this.codebtorForm.get('job_relationship')?.setValue(response.data.id);
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
        this.codebtorForm.get('type_linkage')?.setValue(response.data.id);
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
