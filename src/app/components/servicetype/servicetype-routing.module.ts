import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicetypeComponent } from './servicetype.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ServicetypeComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ServicetypeRoutingModule { }
