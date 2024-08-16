import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ColorPickerModule } from "ngx-color-picker";
import { MaterialModule } from "src/app/shared/directives/material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ServicesRoutingModule } from "./services-routing.module";
import { ServicesComponent } from "./services.component";

@NgModule({
    declarations: [
        ServicesComponent
    ],
  
    imports: [
      CommonModule,
      ServicesRoutingModule,
      MaterialModule,
      SharedModule,
      NgbModule,
      NgSelectModule,
      FormsModule,
      ReactiveFormsModule,
      ColorPickerModule,
      NgSelectModule
    ]
  })
export class ServicesModule { }