import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploymentNatureComponent } from './employment-nature.component';

    
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EmploymentNatureComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class EmploymentNatureRoutingModule { }
