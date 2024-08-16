import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessLoanService {

    constructor(private http: HttpClient) { }

    async getBusinessLoans(serviceId: number, customerId: number, startIndex: number, fetchRecords: number, token: string, dateFrom?: Date, dateTo?: Date, statusId?: number, searchString?: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceId": serviceId, "startIndex": startIndex, "fetchRecords": fetchRecords, "startDate": dateFrom, "endDate": dateTo, "statusId": statusId, "customerId": customerId, "searchString": searchString }));;
        return await this.http.post(environment.apiUrl + "/api/admin/businessLoans/getBusinessLoans", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getBusinessLoanById(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessLoans/getBusinessLoanById", parameter, { headers: reqHeader })
            .toPromise() as any
    }
    async insertBusinessLoanBasicDetail(basicDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessLoans/insertUpdateBusinessLoanBasicDetail", basicDetail, { headers: reqHeader })
            .toPromise() as any
    }
    async insertUpdateBusinessLoanDocuments(loanDocuments:any, customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId, "loanDocuments": loanDocuments,
        }))
        return await this.http.post(environment.apiUrl + "/api/customer/businessLoans/uploadBusinessLoanDocument", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCompanyTypes(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/companyTypes/getCompanyType", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateBusinessLoanBusinessDetail(businessDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessLoans/insertUpdateBusinessLoanBusinessDetail", businessDetail, { headers: reqHeader })
            .toPromise() as any
    }
}