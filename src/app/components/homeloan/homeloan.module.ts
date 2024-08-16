import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HomeLoanRoutingModule } from './homeloan-routing.module';
import { HomeloanComponent } from './homeloan.component';
@NgModule({
    declarations: [HomeloanComponent],
    imports: [
        CommonModule,
        HomeLoanRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AngularEditorModule,
        ReactiveFormsModule,
        NgApexchartsModule
    ]
})
export class HomeLoanModule { }
