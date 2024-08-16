import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddLeadRoutingModule } from './add-lead-routing.module';
import { AddLeadComponent } from './add-lead.component';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddLeadComponent
    ],
    imports: [
        CommonModule,
        AddLeadRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddLeadModule { }