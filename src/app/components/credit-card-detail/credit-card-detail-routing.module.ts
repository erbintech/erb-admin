import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardDetailComponent } from './credit-card-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CreditCardDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreditCardDetailRoutingModule { }
