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
import { User, UserType } from 'src/app/interfaces/user.interface';
import { CreateUserDto } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { formatYearMonthDay } from 'src/app/shared/utilities/date-utils';
import { KeyPressOnlyNumbersValidator } from 'src/app/shared/Validators/keyPressOnlyNumbers';

@Component({
  selector: 'app-new-user-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatError,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule	
  ],
  templateUrl: './new-user-form.component.html',
  styleUrl: './new-user-form.component.scss'
})
export class NewUserFormComponent implements OnInit {
  userForm: FormGroup;
  userTypes = Object.values(UserType); // Tipos de usuario
  documentTypes = Object.values(TypeDocument);
  isEditMode: boolean = false;
  userDataEdit: User;
  hide = true;
  constructor(private fb: FormBuilder, 
      private userService: UserService,
      private authService: AuthService,
      private dialog: MatDialog,
      private snackBar: ToastrService,
      private dialogRef: MatDialogRef<NewUserFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.isEditMode = data?.isEditMode  // Verifica si hay datos de cliente para editar
    this.userDataEdit = data?.user || null; 

    this.userForm = this.fb.group({
      username: [this.userDataEdit?.username || '', [Validators.required, Validators.maxLength(70)]],
      names: [this.userDataEdit?.names || '', [Validators.required, Validators.maxLength(70)]],
      surnames: [this.userDataEdit?.surnames || '',  [Validators.required, Validators.maxLength(70)]],
      email: [this.userDataEdit?.email || '', [Validators.required,  Validators.pattern(
        /^[a-zA-Z0-9._%+-ñÑ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      )]],
      password: ['', []],
      type_user: [this.userDataEdit?.type_user || '', Validators.required],
      type_document: [this.userDataEdit?.type_document || '', Validators.required],
      document: [this.userDataEdit?.document || '', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      department: [this.userDataEdit?.department || '', [Validators.required, Validators.maxLength(70)]],
      city: [this.userDataEdit?.city || '', [Validators.required, Validators.maxLength(70)]],
      cellphone: [this.userDataEdit?.cellphone || '', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      birthdate: [this.userDataEdit?.birthdate || '', Validators.required],
      sede: [this.authService.getSedeUser() || 0, Validators.required],
    });
    this.setPasswordValidators();
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const userValue = this.userForm.value;
    this.userForm.markAllAsTouched();
    console.log(userValue)
      if(this.userForm.valid){
        const message = this.isEditMode
        ? '¿Está seguro de los cambios?'
        : '¿Está seguro de crear este usuario?';
          const dialogRefConfirm = this.dialog.open(ConfirmComponent, {
            width: '400px',
            data: { message }
          });
    
          dialogRefConfirm.afterClosed().subscribe(result => {
            if (result) {
              userValue.birthdate = formatYearMonthDay(userValue.birthdate);
              if(this.isEditMode) {
                delete userValue.password;
                this.userService.updateUser(this.data?.user?.id, userValue).subscribe({
                  next: (response) => {
                    this.dialogRef.close(true);
                    this.snackBar.success(response.message);
                  },
                  error: (err) => {
                    console.error('Error al editar usuario:', err);
                    this.snackBar.error(err.error.error);
                  },
                });
              }else {
                this.userService.createUser(userValue).subscribe({
                  next: (response) => {
                    this.dialogRef.close(true);
                    this.snackBar.success(response.message);
                  },
                  error: (err) => {
                    console.error('Error al crear usuario:', err);
                    this.snackBar.error(err.error.error);
                  },
                });
              }
              
            }
          });
 

    }
  }

  onCancel(): void {
    console.log('Operación cancelada');
  }

  handleKeyPress(event: KeyboardEvent): void {
    KeyPressOnlyNumbersValidator(event);
  }

  convertToLowerCase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    inputElement.value = value.toLowerCase(); // Convierte el valor a minúsculas
    this.userForm.get('username')?.setValue(inputElement.value); // Actualiza el FormControl
  }


  /**
   * Configura los validadores del campo `password` dependiendo de `isEditMode`.
   */
  private setPasswordValidators(): void {
    const passwordControl = this.userForm.get('password');
    const validators = this.isEditMode
      ? [Validators.maxLength(70)] // Solo maxLength en modo edición
      : [Validators.required, Validators.maxLength(70)]; // Required y maxLength en modo creación

    passwordControl?.setValidators(validators);
    passwordControl?.updateValueAndValidity(); // Actualiza el estado del control
  }
  
}