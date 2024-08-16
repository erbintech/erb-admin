import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherServiceComponent } from './other-service.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OtherServiceComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class OtherServiceRoutingModule { }
