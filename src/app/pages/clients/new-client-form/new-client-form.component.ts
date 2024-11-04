import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    MatError,
    MatIconModule,
  ],
  templateUrl: './new-client-form.component.html',
  styleUrl: './new-client-form.component.scss'
})
export class NewClientFormComponent implements OnInit {
  clientForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);
  lisJobRelationShips: JobRelationship[] = [];
  addingNewRelationship = false; // Controla si se está agregando un nueva RL
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
      document_number: [
        this.clientData.document_number || '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [this.clientData.email || '', [Validators.required, Validators.email]],
      place_of_issue: [this.clientData.place_of_issue || '', Validators.required],
      gender: [this.clientData.gender || '', Validators.required],
      phone: [this.clientData.phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      mobile: [this.clientData.mobile || '',
      [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [this.clientData.address || '', Validators.required],
      neighborhood: [this.clientData.neighborhood || '', Validators.required],
      city: [this.clientData.city || '', Validators.required],
      office_phone: [this.clientData.office_phone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      type_of_linkage: [this.clientData.type_of_linkage || '', Validators.required],
      sede: [this.clientData.sede || this.authService.getSedeUser(), Validators.required],
      job_relationship: [this.clientData.job_relationship?.id || '', Validators.required],
      newRelationshipName: ['', Validators.maxLength(250)],
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




   // Método para mostrar el campo de entrada de la nueva relación
   toggleAddNewRelationship(): void {
    this.addingNewRelationship = true;
    this.clientForm.get('newRelationshipName')?.setValue('');
  }

  // Método para guardar la nueva relación de trabajo
  saveNewRelationship(): void {
    if (this.clientForm.get('newRelationshipName')?.value.trim()) {
      // Crear un nuevo objeto de relación de trabajo con un ID temporal
      // const newRelationship: JobRelationship =  {
      //   id: this.lisJobRelationShips.length + 1, // Genera un ID temporal
      //   name: this.clientForm.get('newRelationshipName')?.value,
      //   sede: Number(this.authService.getSedeUser())
      // };
      this.clientService.addJobRelationship(Number(this.authService.getSedeUser()), this.clientForm.get('newRelationshipName')?.value)
        .subscribe( response =>{
          this.lisJobRelationShips.push(response);
          this.clientForm.get('job_relationship')?.setValue(response.id);
        }, error=>{
          this.snackBar.error(error.error.error);
        });

      // Agrega la nueva relación a la lista y selecciona la opción
      // this.lisJobRelationShips.push(newRelationship);
      // this.clientForm.get('job_relationship')?.setValue(newRelationship.id);

      // Reinicia los valores
      this.addingNewRelationship = false;
      this.clientForm.get('newRelationshipName')?.setValue('');
    }
  }

  // Método para cancelar la adición de una nueva relación de trabajo
  cancelAddNewRelationship(): void {
    this.addingNewRelationship = false;
    this.clientForm.get('newRelationshipName')?.setValue('');
  }
}
