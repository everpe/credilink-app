import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  changePasswordForm: FormGroup;
  isSubmitting = false;
  hideCurrent = true;
  hidePassword = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private toastr: ToastrService
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.invalid) {
      this.toastr.warning('Por favor, completa el formulario correctamente.');
      return;
    }

    if (this.f['password'].value !== this.f['password_confirm'].value) {
      this.toastr.error('Las contraseñas no coinciden.');
      return;
    }

    this.isSubmitting = true;

    this.userService.updatePassword(
      this.f['current_password'].value,
      this.f['password'].value,
      this.f['password_confirm'].value
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.toastr.success(response.message);
          this.changePasswordForm.reset();
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        console.error(error);
        this.isSubmitting = false;
      },
    });
  }
}
