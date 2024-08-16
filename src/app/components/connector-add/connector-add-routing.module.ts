import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorAddComponent } from './connector-add.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ConnectorAddComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConnectorAddRoutingModule { }
