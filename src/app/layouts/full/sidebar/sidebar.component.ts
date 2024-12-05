import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../services/nav.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'

})
export class SidebarComponent implements OnInit {
  navItems = navItems;

  constructor(public navService: NavService,
              public dialog: MatDialog,
              private authService: AuthService) { }
  logout(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { message : `¿Está seguro que deseas cerrar sesión ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout(); 
      }
    });


  }
  ngOnInit(): void {}

}
