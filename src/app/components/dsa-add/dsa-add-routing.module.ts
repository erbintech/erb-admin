import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsaAddComponent } from './dsa-add.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DsaAddComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DsaAddRoutingModule { }
