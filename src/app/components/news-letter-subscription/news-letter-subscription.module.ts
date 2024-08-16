import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsLetterSubscriptionComponent } from './news-letter-subscription.component';
import { NewsLetterSubscriptionRoutingModule } from './news-letter-subscription-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    NewsLetterSubscriptionComponent
  ],
  imports: [
    CommonModule,
    NewsLetterSubscriptionRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class NewsLetterSubscriptionModule { }
