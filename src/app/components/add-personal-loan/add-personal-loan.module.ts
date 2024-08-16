import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPersonalLoanRoutingModule } from './add-personal-loan-routing.module';
import { AddPersonalLoanComponent } from './add-personal-loan.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddPersonalLoanComponent
    ],
    imports: [
        CommonModule,
        AddPersonalLoanRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule,
        MatAutocompleteModule
    ]
})
export class AddPersonalLoanModule { }