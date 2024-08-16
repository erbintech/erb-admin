import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHomeLoanComponent } from './add-home-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddHomeLoanComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddHomeLoanRoutingModule { }
