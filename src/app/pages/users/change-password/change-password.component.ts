import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isSubmitting = false;
  hide = true;
  idUser = 0;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
     private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.idUser = data?.id;
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.toastr.warning('Por favor, completa el formulario correctamente.');
      return;
    }

    if (this.f['password'].value !== this.f['password_confirm'].value) {
      this.toastr.error('Las contraseñas no coinciden.');
      return;
    }

    this.isSubmitting = true;

    this.authService.changePassword(this.idUser, this.f['password'].value, this.f['password_confirm'].value).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.changePasswordForm.reset();
        this.dialogRef.close(true);
        // this.authService.logout();
      },
      error: (error) => {
        this.toastr.error('Error al cambiar la contraseña. Inténtalo nuevamente.');
        console.error(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
