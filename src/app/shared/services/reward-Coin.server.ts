import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RewardCoin } from '../models/reward-coin';

@Injectable({
    providedIn: 'root'
})
export class RewardCoinService {

    constructor(private http: HttpClient) { }

    async getRewardCoin(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        var reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/rewardCoin/getRewardCoin", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateRewardCoin(rewardCoin: RewardCoin, token: string): Promise<any> {
        var reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/rewardCoin/insertUpdateRewardCoin", rewardCoin, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveRewardCoin(id: number, isActive: boolean, token: string): Promise<any> {
        var parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        var reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/maritalStatuses/activeInactiveRewardCoin", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async getRewardType(token: string): Promise<any> {
        var reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/rewardCoin/getRewardType", {}, { headers: reqHeader })
            .toPromise() as any
    }

}