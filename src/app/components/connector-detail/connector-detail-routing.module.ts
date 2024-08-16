import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorDetailComponent } from './connector-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ConnectorDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConnectorDetailRoutingModule { }
