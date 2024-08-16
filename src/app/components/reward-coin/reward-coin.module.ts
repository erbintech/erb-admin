import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardCoinComponent } from './reward-coin.component';
import { RewardCoinRoutingModule } from './reward-coin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    RewardCoinComponent
  ],
  imports: [
    CommonModule,
    RewardCoinRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RewardCoinModule { }
