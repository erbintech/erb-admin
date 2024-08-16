import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPermissionGroupRoutingModule } from './add-permission-group-routing.module';
import { AddPermissionGroupComponent } from './add-permission-group.component';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddPermissionGroupComponent
    ],
    imports: [
        CommonModule,
        AddPermissionGroupRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
    ]
})
export class AddPermissionGroupModule { }