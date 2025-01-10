import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SedeDto } from 'src/app/interfaces/sede.interface';
import { SedeService } from 'src/app/services/sedes/sede.service';
import { NewFormSedeComponent } from './new-form-sede/new-form-sede.component';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-sedes',
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
  templateUrl: './sedes.component.html',
  styleUrl: './sedes.component.scss'
})
export class SedesComponent implements OnInit {  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sedes = new MatTableDataSource<SedeDto>([]);
  displayedColumns: string[] = [
    'actions',
    'name',
    'responsible_name',
    'corporate_email',
    'city',
    'address',
    'coporative_phone',
    'status',
  ];
  isLoading = true;

  constructor(
    private sedeService: SedeService,
    private dialog: MatDialog,
    private snackBar: ToastrService
  ) { }

  ngOnInit(): void {
    this.sedes.paginator = this.paginator;
    this.loadSedes();
  }

  loadSedes(): void {
    this.isLoading = true;
    this.sedeService.getSedes().subscribe({
      next: (data) => {
        this.sedes.data = data;
        this.sedes.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar las sedes:', err);
        this.snackBar.error('Error al cargar las sedes.');
        this.isLoading = false;
      },
    });
  }

  editSede(sede: SedeDto): void {
    const dialogRef = this.dialog.open(NewFormSedeComponent, {
      width: '750px',
      data: { sede: sede, isEditMode: true },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSedes();
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }

  toggleSedeStatus(sede: SedeDto): void {
    const action = sede.status ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message: `¿Está seguro que desea ${action} la sede: ${sede.name.toUpperCase()} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sedeService.deleteSede(sede.id).subscribe({
          next: (response) => {
            this.snackBar.success(response.message);
            this.loadSedes(); // Refresca la lista
          },
          error: (err) => {
            console.error(`Error al ${action} la sede:`, err);
            this.snackBar.error(`No se pudo ${action} la sede.`);
          },
        });
      }
    });
  }

  openNewSedeDialog() {
    const dialogRef = this.dialog.open(NewFormSedeComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSedes();
      } else {
        this.snackBar.info('Cambios no efectuados.');
      }
    });
  }
}
