import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAddComponent } from './customer-add.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CustomerAddComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerAddRoutingModule { }
