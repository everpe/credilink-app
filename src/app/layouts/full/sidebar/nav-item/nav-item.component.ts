import { Component, Input, OnChanges } from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserType } from 'src/app/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Input() item: NavItem | any;
  @Input() depth: any;
   userType: any;
  constructor(public navService: NavService,
    public router: Router,
    private authService: AuthService,
    private snackBar: ToastrService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }


    this.userType = authService.getTypeUserLogged();
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {    
      this.router.navigate([item.route]);
    }
  }

  canShowItem(): boolean {
    if (this.userType === UserType.ADMIN) {
      return (
        this.item.route === '/move/sede' ||
        this.item.route === '/users'
      );
    }
    return true; // Otros tipos de usuarios pueden ver todos los ítems
  }
}
