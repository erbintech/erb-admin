import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InstantLonRoutingModule } from './instant-loan-routing.module';
import { InstantLoanComponent } from './instant-loan.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
    declarations: [InstantLoanComponent],
    imports: [
        CommonModule,
        InstantLonRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AngularEditorModule,
        NgApexchartsModule
        // ArchwizardModule
    ]
})
export class InstantLoanModule { }
