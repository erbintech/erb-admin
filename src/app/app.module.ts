import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from './shared/auth.guard';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { PermissiondeniedComponent } from './permissiondenied/permissiondenied.component';

@NgModule({
  declarations: [
    AppComponent,
    //AuthenticationComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    //AlertComponent,
    PermissiondeniedComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
