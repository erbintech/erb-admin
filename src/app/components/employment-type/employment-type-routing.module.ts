import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploymentTypeComponent } from './employment-type.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EmploymentTypeComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmploymentTypeRoutingModule { }
