import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { AddPostComponent } from './posts/components/add-post/add-post.component';
import { PostDashboardComponent } from './posts/components/post-dashboard/post-dashboard.component';

import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, AdminComponent, AddPostComponent,  PostDashboardComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    AdminRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule {}
