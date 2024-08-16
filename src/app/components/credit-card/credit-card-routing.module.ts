import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardComponent } from './credit-card.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CreditCardComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreditCardRoutingModule { }
