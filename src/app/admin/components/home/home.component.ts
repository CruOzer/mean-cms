import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => (this.isLoggedIn = isAuth));
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogoutClick() {
    this.authService.logout();
  }
}
