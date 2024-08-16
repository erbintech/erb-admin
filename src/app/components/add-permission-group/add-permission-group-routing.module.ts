import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPermissionGroupComponent } from './add-permission-group.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddPermissionGroupComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddPermissionGroupRoutingModule { }
