import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {PostAddComponent} from './post/post-add/post-add.component';
import {AuthGuard} from './auth/auth.guard';
import {PostViewComponent} from './post/post-view/post-view.component';
import {ProfileComponent} from './auth/profile/profile.component';
import {NotFoundComponent} from './shared/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'post/:id', component: PostViewComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'post-add', component: PostAddComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path: '404', component: NotFoundComponent},
  {path: 'api/**', redirectTo: '/404'},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
