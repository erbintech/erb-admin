import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalLoanDetailComponent } from './personal-loan-detail.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PersonalLoanDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PersonalLoanDetailRoutingModule { }
