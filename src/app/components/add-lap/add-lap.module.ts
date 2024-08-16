import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddLapRoutingModule } from './add-lap-routing.module';
import { AddLapComponent } from './add-lap.component';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddLapComponent
    ],
    imports: [
        CommonModule,
        AddLapRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddLapModule { }