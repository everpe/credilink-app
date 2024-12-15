import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequestDto } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';   
import { UserType } from 'src/app/interfaces/user.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  loginForm!: FormGroup;  
  hide = true; // Variable para alternar la visibilidad de la contraseña
  isLoading = false;
  constructor(
    private fb: FormBuilder,      
    private authService: AuthService,  
    private snackBar: ToastrService, 
    private router: Router          
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],    
      password: ['', [Validators.required]],     
      rememberMe: [false]                        
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequestDto = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      this.isLoading = true;
      this.authService.login(loginData).subscribe(
        (response) => {
          this.authService.setToken(response.token);
          this.authService.setSedeUserToStorage(response.data.company.sedes[0].id.toString())
          this.authService.setDateLogged(new Date(Date.now()));
          this.authService.setUserLogged(response.data.username)
          this.authService.setTypeUserLogged(response.data.type_user)
          if(response.data.type_user == UserType.ADMIN){
            this.router.navigate(['/move/sede']);
          }else{
            this.router.navigate(['/credits']);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.log(error)
          this.snackBar.error(
            error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.',
            'Inicio de sesión fallido'
          );
        }
      );
    }
  }
}
