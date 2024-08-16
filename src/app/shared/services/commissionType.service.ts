import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commission } from '../models/commission';

@Injectable({
    providedIn: 'root'
})
export class CommissionService {

    constructor(private http: HttpClient) { }

    async getCommissionType(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/commissionTypes/getCommissionType", parameter, { headers: reqHeader })
            .toPromise() as any
    }


    async getCommission(startIndex: number, fetchRecords: number, bankIds: any, serviceIds: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankIds": bankIds, "serviceIds": serviceIds }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoanCommission/getBankLoanCommission", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateBankLoanCommission(bankId:any, commission: Commission[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "bankId": bankId, "bankCommissions": commission }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoanCommission/insertUpdateBankLoanCommission", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdatePartnerLoanCommission(partnerId: number, commission: Commission[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "partnerId": partnerId, "commissions": commission }))
        return await this.http.post(environment.apiUrl + "/api/admin/partnerCommission/insertUpdatePartnerCommission", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getPartnerCommission(roles: string, startIndex: number, fetchRecords: number, bankId: number, serviceId: number, commissionTypeId: number, partnerId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankId": bankId, "serviceId": serviceId, "commissionTypeId": commissionTypeId, "roles": roles, "partnerId": partnerId }))
        return await this.http.post(environment.apiUrl + "/api/admin/partnerCommission/getBankLoanPartnerCommission", parameter, { headers: reqHeader })
            .toPromise() as any
    }

}