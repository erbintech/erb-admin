import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceWiseDocumentsRoutingModule } from './service-wise-documents-routing.module';
import { ServiceWiseDocumentsComponent } from './service-wise-documents.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    declarations: [ServiceWiseDocumentsComponent],
    imports: [
        CommonModule,
        ServiceWiseDocumentsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class ServiceWiseDocumentsModule { }
