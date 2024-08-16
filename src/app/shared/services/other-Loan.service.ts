import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OtherLoan } from '../models/other-loan';

@Injectable({
    providedIn: 'root'
})
export class OtherLoanService {

    constructor(private http: HttpClient) { }

    async getOtherLoan(startIndex: number, fetchRecord: number, searchString: string, serviceIds : any, serviceTypeId: any, userId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecord": fetchRecord, "searchString": searchString, "serviceIds": serviceIds, "serviceTypeId": serviceTypeId, "userId": userId }))
        return await this.http.post(environment.apiUrl + "/api/admin/otherLoan/getOtherLoan", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateOtherLoanDetail(otherLoan: OtherLoan, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "id": id, "fullName": fullName, "rewardTypeId": rewardTypeId,"minLoanFile": minLoanFile, "maxLoanFile": maxLoanFile }));
        return await this.http.post(environment.apiUrl + "/api/admin/otherLoan/insertUpdateOtherLoanDetail", otherLoan, { headers: reqHeader })
            .toPromise() as any
    }

    async changeLoanStatus(customerLoanId: number, loanStatusId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId, "loanStatusId": loanStatusId }))
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/changeLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getServicesByServiceTypeId(serviceTypeId: any, fetchRecord: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecord": fetchRecord, "serviceTypeId": serviceTypeId }))
        return await this.http.post(environment.apiUrl + "/api/customer/services/getServicesByServiceTypeId", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getEmploymentTypes(fetchRecord: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecord": fetchRecord }))
        return await this.http.post(environment.apiUrl + "/api/partner/employmentTypes/getEmploymentTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

}