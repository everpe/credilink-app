import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SedeMinDto } from 'src/app/interfaces/sede.interface';
import { UserType } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SedeService } from 'src/app/services/sedes/sede.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-move-sede',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule, 
    RouterModule, 
    MatIconModule
  ],
  templateUrl: './move-sede.component.html',
  styleUrl: './move-sede.component.scss'
})
export class MoveSedeComponent implements OnInit {
  sedes: SedeMinDto[] = [];
  currentSedeId: number | null = null;

  constructor(private sedeService: SedeService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSedes();
    this.loadCurrentSede();
  }

  loadSedes(): void {
    this.sedeService.getSedesMin().subscribe((data) => {
      this.sedes = data;
    });
  }



  loadCurrentSede(): void {
    const storedSedeId = this.authService.getSedeUser();
    if (storedSedeId) {
      this.currentSedeId = Number(storedSedeId);
    }
  }
  selectSede(sede: SedeMinDto): void {

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message: `¿Está seguro que desea moverse a la sede ${sede.name.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

   
        if(this.authService.getTypeUserLogged() == UserType.ADMIN ) {
          this.currentSedeId = sede.id;
          // Puedes guardar la sede actual en el localStorage o llamar a un servicio para establecerla globalmente
          this.authService.setSedeUserToStorage(sede.id.toString());
        
        }else{
          this.snackBar.error('No cuenta con permisos de administrador');
        }

      }
    });



  }

  isCurrentSede(sedeId: number): boolean {
    return this.currentSedeId === sedeId;
  }
}
