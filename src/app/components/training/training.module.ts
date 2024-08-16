import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';

@NgModule({
    declarations: [TrainingComponent],
    imports: [
        CommonModule,
        TrainingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class TrainingModule { }
