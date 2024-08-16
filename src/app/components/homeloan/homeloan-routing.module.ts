import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeloanComponent } from './homeloan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: HomeloanComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeLoanRoutingModule { }
