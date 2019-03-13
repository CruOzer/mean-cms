import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    AngularMaterialModule
  ]
})
export class AuthModule {}
