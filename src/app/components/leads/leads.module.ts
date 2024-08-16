import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        LeadsComponent
    ],
    imports: [
        CommonModule,
        LeadsRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class LeadsModule { }
