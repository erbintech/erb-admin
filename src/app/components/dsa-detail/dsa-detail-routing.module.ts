import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsaDetailComponent } from './dsa-detail.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DsaDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DsaDetailRoutingModule { }
