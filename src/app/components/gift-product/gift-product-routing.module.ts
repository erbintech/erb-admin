import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftProductComponent } from './gift-product.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: GiftProductComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiftProductRoutingModule { }
