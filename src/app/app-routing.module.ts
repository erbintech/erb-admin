import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PermissiondeniedComponent } from './permissiondenied/permissiondenied.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from './shared/auth.guard';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { Full_Content_Routes } from './shared/routes/full.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'permission-denied',
    component: PermissiondeniedComponent
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: Full_Content_Routes
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    // relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
