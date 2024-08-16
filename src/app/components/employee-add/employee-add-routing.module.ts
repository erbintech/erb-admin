import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAddComponent } from './employee-add.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EmployeeAddComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeAddRoutingModule { }
