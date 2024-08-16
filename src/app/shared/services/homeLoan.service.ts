import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeLoanService {

    constructor(private http: HttpClient) { }

    async getHomeLoans(serviceId: number, customerId: number, startIndex: number, fetchRecords: number, token: string, dateFrom?: Date, dateTo?: Date, statusId?: number, searchString?: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceId": serviceId, "startIndex": startIndex, "fetchRecords": fetchRecords, "startDate": dateFrom, "endDate": dateTo, "statusId": statusId, "customerId": customerId, "searchString": searchString }));;
        return await this.http.post(environment.apiUrl + "/api/admin/homeLoan/getHomeLoan", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getHomeLoanById(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));;
        return await this.http.post(environment.apiUrl + "/api/admin/homeLoan/getHomeLoanById", parameter, { headers: reqHeader })
            .toPromise() as any
    }
    async insertHomeLoanBasicDetail(basicDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/homeloan/insertUpdateHomeLoanBasicDetail", basicDetail, { headers: reqHeader })
            .toPromise() as any
    }
    async insertHomeLoanPropertyDetail(basicDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/homeloan/insertUpdateHomeLoanPropertyDetail", basicDetail, { headers: reqHeader })
            .toPromise() as any
    }

    async insertHomeLoanWorkDetail(workDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/homeloan/insertUpdateHomeLoanCustomerEmploymentDetail", workDetail, { headers: reqHeader })
            .toPromise() as any
    }
    async insertHomeLoanDocuments(loanDocuments:any, customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId, "loanDocuments": loanDocuments
        }))
        return await this.http.post(environment.apiUrl + "/api/customer/homeLoans/uploadHomeLoanDocument", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertHomeLoanTransferPropertyDetail(loanTransferPropertyDetail:any, token: string) {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/customer/homeLoans/insertUpdateCustomerLoanTransferPropertyDetail", loanTransferPropertyDetail, { headers: reqHeader })
            .toPromise() as any
    }
}