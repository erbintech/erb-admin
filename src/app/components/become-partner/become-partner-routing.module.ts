import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BecomePartnerComponent } from './become-partner.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BecomePartnerComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BecomePartnerRoutingModule { }
