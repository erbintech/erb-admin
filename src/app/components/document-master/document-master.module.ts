import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumnetMasterRoutingModule } from './document-master-routing.module';
import { DocumentMasterComponent } from './document-master.component';

@NgModule({
    declarations: [DocumentMasterComponent],
    imports: [
        CommonModule,
        DocumnetMasterRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule
    ]
})
export class DocumentMasterModule { }
