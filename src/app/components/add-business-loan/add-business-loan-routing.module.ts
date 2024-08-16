import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBusinessLoanComponent } from './add-business-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddBusinessLoanComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddBusinessLoanRoutingModule { }
