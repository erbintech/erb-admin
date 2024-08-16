import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessNatureComponent } from './business-nature.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessNatureComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BusinessNatureRoutingModule { }
