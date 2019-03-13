import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../AuthData';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getIsAuth();
  }

  ngOnDestroy(): void {
  }


  onRegisterSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const authData: AuthData = {
      name: form.value.inputName,
      email: form.value.email,
      password: form.value.password,
      username: form.value.username
    };
    this.authService.createUser(authData);
  }
}
