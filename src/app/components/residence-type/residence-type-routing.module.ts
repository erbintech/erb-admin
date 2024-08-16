import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidenceTypeComponent } from './residence-type.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ResidenceTypeComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ResidenceTypeRoutingModule { }
