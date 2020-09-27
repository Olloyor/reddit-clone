import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth.reducer';

import {AppComponent} from './app.component';

import {AppRoutingModule} from './app-routing.module';
import {TokenInterceptor} from './token-interceptor';
import {HeaderComponent} from './header/header.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { PostAddComponent } from './post/post-add/post-add.component';
import { PostViewComponent } from './post/post-view/post-view.component';
import { PostTileComponent } from './post/post-tile/post-tile.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { VoteButtonComponent } from './shared/vote-button/vote-button.component';
import {ToastrModule} from 'ngx-toastr';
import { NotFoundComponent } from './shared/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    PostViewComponent,
    PostAddComponent,
    PostTileComponent,
    SideBarComponent,
    VoteButtonComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    // RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot({auth: authReducer}),
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
