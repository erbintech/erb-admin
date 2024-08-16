import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubdsaComponent } from './subdsa.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SubdsaComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubDsaRoutingModule { }
