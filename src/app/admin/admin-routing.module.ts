import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { PostDashboardComponent } from "./posts/components/post-dashboard/post-dashboard.component";
import { AddPostComponent } from './posts/components/add-post/add-post.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
      { path: 'posts', children: [
        { path: '', component: PostDashboardComponent},
        { path: 'add', component: AddPostComponent},
        { path: 'edit/:postId', component: AddPostComponent}
      ] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AdminRoutingModule {}
