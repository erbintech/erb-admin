import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddCreditCardComponent } from './add-credit-card.component';
import { AddCreditCardRoutingModule } from './add-credit-card-routing.module';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddCreditCardComponent
    ],
    imports: [
        CommonModule,
        AddCreditCardRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddCreditCardnModule { }