import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardCoinComponent } from './reward-coin.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: RewardCoinComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class RewardCoinRoutingModule { }
