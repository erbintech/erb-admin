import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPersonalLoanComponent } from './add-personal-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddPersonalLoanComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddPersonalLoanRoutingModule { }
