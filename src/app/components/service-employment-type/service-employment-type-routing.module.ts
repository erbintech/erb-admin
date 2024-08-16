import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceEmploymentTypeComponent } from './service-employment-type.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ServiceEmploymentTypeComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServiceEmploymentTypeRoutingModule { }
