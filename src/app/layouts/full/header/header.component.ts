import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  loggedUSer = '';
  loggedDate: Date;

  constructor(public dialog: MatDialog, private authService: AuthService) { 
    this.loggedUSer = this.authService.getUserLogged() ?? '';
    this.loggedDate = this.authService.getDateLogged() ?? new Date();
  }
  logout(): void {
    this.authService.logout(); 
  }
}
