import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsComponent } from './faqs.component';
import { faqsRoutingModule } from './faqs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    FaqsComponent
  ],
  imports: [
    CommonModule,
    faqsRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularEditorModule,
  ]
})
export class FaqsModule { }
