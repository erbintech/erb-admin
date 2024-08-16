import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressTypeComponent } from './address-type.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddressTypeComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddressTypeRoutingModule { }
