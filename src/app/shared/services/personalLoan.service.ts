import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoanDetail } from '../models/loanDetail';
import { LoanOffer } from '../models/loanOffer';
import { AdminPersonalLoanDocumentResponse } from '../models/loans/adminPersonalloanDocumentsResponse';
import { Offer } from '../models/offer';
import { RejectionReason } from '../models/rejectionReason';

@Injectable({
    providedIn: 'root'
})
export class PersonalLoanService {

    constructor(private http: HttpClient) { }

    async getTenure(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/getTenure", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getCompanyCategories(): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": "Adminpanel" });
        // let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString }))
        return await this.http.post(environment.apiUrl + "/api/customer/serviceMasterData/getCompanyCategories", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getPersonalLoans(serviceId: number, customerId: number, startIndex: number, fetchRecords: number, token: string, dateFrom?: Date, dateTo?: Date, statusId?: number, searchString?: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceId": serviceId, "startIndex": startIndex, "fetchRecords": fetchRecords, "startDate": dateFrom, "endDate": dateTo, "statusId": statusId, "customerId": customerId, "searchString": searchString }));;
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/getPersonalLoan", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getPersonalLoanById(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/getPersonalLoanById", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async assignToRM(customerLoanId: number, userId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId, "userId": userId }));
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/assignToRM", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async changeDocumentStatus(pendency: string, documents: AdminPersonalLoanDocumentResponse[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "pendency": pendency, "loanDocuments": documents }));
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/changeDocumentStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getGeneratedOffer(offer:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/getOffer", offer, { headers: reqHeader })
            .toPromise() as any
    }

    async insertSelectedOffer(customerLoanId: number, offer: Offer[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId, "selectedOffer": offer }));
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertSelectedOffer", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getSelectedOffer(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));
        return await this.http.post(environment.apiUrl + "/api/customer/personalLoans/getGeneratedOffer", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertLoanDetail(loanDetail: LoanDetail, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertLoanDetail", loanDetail, { headers: reqHeader })
            .toPromise() as any
    }

    async insertRejectionReason(id: number, customerLoanId: number, reason: string, rejectionReason: RejectionReason[], token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "customerLoanId": customerLoanId, "reasons": rejectionReason, "reason": reason }));
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertUpdateLoanRejectionReason", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCustomerLoanRejectionReason(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));
        return await this.http.post(environment.apiUrl + "/api/customer/personalLoans/getLoanRejectionReason", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPersonLoanBasicDetail(basicDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertUpdatePersonalLoanBasicDetail", basicDetail, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPersonLoanEmploymentDetail(basicDetail:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertUpdatePersonalLoanEmploymentDetail", basicDetail, { headers: reqHeader })
            .toPromise() as any
    }

    async getCompanyTypes(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/web/companyTypes/getCompanyTypes", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPersonalLoanDocuments(loanDocuments:any, loanRefrences:any, customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId, "loanDocuments": loanDocuments, "loanReferences": loanRefrences
        }))
        return await this.http.post(environment.apiUrl + "/api/customer/personalLoans/uploadPersonalLoanDocumentAndReference", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateLoanAmount(customerLoanId: number, loanAmount: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId, "loanAmount": loanAmount
        }))
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/updatePersonalLoanAmount", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertLoanOffer(loanOffer: LoanOffer, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/insertOffer", loanOffer, { headers: reqHeader })
            .toPromise() as any
    }

    async getLoanOffer(customerLoanId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }));
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/getLoanOffer", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async deleteLoanById(customerLoanId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/deleteLoanById", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async changeEmploymentType(customerLoanId: number, serviceId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId,
            "serviceId": serviceId
        }))
        return await this.http.post(environment.apiUrl + "/api/customer/personalLoans/changeEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async changeLoanType(customerLoanId: number, serviceId: number,isTransfer:string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({
            "customerLoanId": customerLoanId,
            "serviceId": serviceId,
            "loanTypeName":isTransfer
        }))
        return await this.http.post(environment.apiUrl + "/api/customer/personalLoans/newToTransfer", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async acceptOffer(bankOfferId:number, isAccept: boolean, token: string, status: string, customerLoanId: number,customerloanoffersId:number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "bankOfferId": bankOfferId, "isAccept": isAccept, "status": status, "customerLoanId": customerLoanId ,"customerloanoffersId" : customerloanoffersId}))
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/acceptLoanOffer", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async disbursedApplication(element:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/personalLoans/disbursedApplication", element, { headers: reqHeader })
            .toPromise() as any;
    }
}