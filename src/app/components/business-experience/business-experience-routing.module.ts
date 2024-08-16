import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessExperienceComponent } from './business-experience.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessExperienceComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BusinessExperienceRoutingModule { }
