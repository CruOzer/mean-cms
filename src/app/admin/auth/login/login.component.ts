import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../services/auth.service';

import { AuthData } from '../AuthData';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getIsAuth();
  }

  ngOnDestroy(): void {}

  onLoginSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const authData: AuthData = {
      password: form.value.password,
      username: form.value.username
    };
    this.authService.login(authData);
  }
}
