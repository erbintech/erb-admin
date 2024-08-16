import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LAPComponent } from './lap.component';
import { LAPRoutingModule } from './lap-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        LAPComponent
    ],
    imports: [
        CommonModule,
        LAPRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgApexchartsModule,
        AngularEditorModule
    ]
})
export class LAPModule { }
