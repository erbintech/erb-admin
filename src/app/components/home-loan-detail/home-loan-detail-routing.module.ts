import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLoanDetailComponent } from './home-loan-detail.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: HomeLoanDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeLoanDetailRoutingModule { }
