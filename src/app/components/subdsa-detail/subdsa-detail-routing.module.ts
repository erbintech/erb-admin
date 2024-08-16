import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubdsaDetailComponent } from './subdsa-detail.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SubdsaDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubdsaDetailRoutingModule { }
