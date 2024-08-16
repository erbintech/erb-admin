import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrainingCategoryRoutingModule } from './training-category-routing.module';
import { TrainingCategoryComponent } from './training-category.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModule } from 'src/app/common/alert/alert.mocule';

@NgModule({
    declarations: [TrainingCategoryComponent],
    imports: [
        CommonModule,
        TrainingCategoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AlertModule
    ]
})
export class TrainingCategoryModule { }
