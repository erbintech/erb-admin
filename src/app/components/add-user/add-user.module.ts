import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
       AddUserComponent
    ],
    imports: [
        CommonModule,
        AddUserRoutingModule,
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
export class AddUserModule { }