import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AlertModule } from '../common/alert/alert.mocule';

@NgModule({
    declarations: [
        AuthenticationComponent
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule,
        AlertModule
    ]
})
export class AuthenticationModule { }
