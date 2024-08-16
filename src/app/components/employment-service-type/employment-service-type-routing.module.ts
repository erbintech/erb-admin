import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploymentServiceTypeComponent } from './employment-service-type.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EmploymentServiceTypeComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class EmploymentServiceTypeRoutingModule { }
