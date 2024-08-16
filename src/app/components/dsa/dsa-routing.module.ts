import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsaComponent } from './dsa.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DsaComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DsaRoutingModule { }
