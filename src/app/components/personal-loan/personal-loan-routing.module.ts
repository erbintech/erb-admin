import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalLoanComponent } from './personal-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PersonalLoanComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PersonalLoanRoutingModule { }
