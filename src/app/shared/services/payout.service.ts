import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PayoutService {

    constructor(private http: HttpClient) { }

    async getPartnerPayout(startIndex: number, fetchRecords: number, searchString: string,fromDate:any,toDate:any,serviceId:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString,"fromDate":fromDate,"toDate":toDate,"serviceId":serviceId }))
        return await this.http.post(environment.apiUrl + "/api/admin/payout/getPartnerPayout", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async payoutRelease(partnerId: number, commission: number, partnerCommissionId: number, loanDetailId: number,serviceName:string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "partnerId": partnerId, "commission": commission, "partnerCommissionId": partnerCommissionId, "loanDetailId": loanDetailId,"serviceName":serviceName }))
        return await this.http.post(environment.apiUrl + "/api/admin/payout/payoutRelease", parameter, { headers: reqHeader })
            .toPromise() as any
    }
}