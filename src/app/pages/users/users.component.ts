import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
      FormsModule,
      MatTableModule,
      MatButtonModule,
      MatPaginatorModule,
      MatCard,
      MatCardHeader,
      MatCardContent,
      MatIconModule,
      MatMenuModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatInputModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  search = new FormControl('');
  usersDatasource: User[] = [];
  displayedColumns: string[] = [
    'actions',
    'username', 
    'names', 
    'email', 
    'type_user', 
    'document', 
    'birthdate'
  ];
  totalUsers = 0;
  limit = 10;
  offset = 0;
  sede = 0;

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private snackBar: ToastrService,
              private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sede = Number(this.authService.getSedeUser())

    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.loadUsers();
      });

    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.offset, this.limit, this.sede, this.search.value?.trim().toLowerCase() ?? '').subscribe({
      next: (response) => {
        this.usersDatasource = response.results;
        this.totalUsers = response.count;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  onPageChange(event: any): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.loadUsers();
  }

  openNewUserDialog(): void {
    const dialogRef = this.dialog.open(NewUserFormComponent, {
      width: '700px',
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); 
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  downloadReport(): void {
    console.log('Descargar reporte de usuarios');
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(NewUserFormComponent, {
      width: '750px',
      data: { user, isEditMode: true },  
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.loadUsers();  
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que desea desactivar este usuario: ${user.username.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUserById(user.id).subscribe((resp:any) => {
          this.snackBar.success(resp.message);
          this.loadUsers(); 
        }, 
        error => {
          this.snackBar.error(error.error.error);
          console.error(error);
        });;
      }
    });
  }
}
