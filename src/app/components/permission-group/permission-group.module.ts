import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PermissionGroupRoutingModule } from './permission-group-routing.module';
import { PermissionGroupComponent } from './permission-group.component';
import { AlertModule } from 'src/app/common/alert/alert.mocule';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        PermissionGroupComponent
    ],
    imports: [
        CommonModule,
        PermissionGroupRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        AlertModule
    ]
})
export class PermissionGroupModule { }