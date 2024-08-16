import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commission } from '../models/commission';
import { CreditCard } from '../models/credit-card';
import { RejectionReason } from '../models/rejectionReason';

@Injectable({
    providedIn: 'root'
})
export class CreditCardService {

    constructor(private http: HttpClient) { }

    async insertUpdateCreditCard(creditCard: CreditCard, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/insertUpdateCreditCard", creditCard, { headers: reqHeader })
            .toPromise() as any
    }

    async getEducationType(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/partner/educationTypes/getEducationTypes", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getCreditCard(startIndex: number, fetchRecord: number, dateFrom:any, dateTo:any, customerId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecord, "dateFrom": dateFrom, "dateTo": dateTo, "customerId": customerId }))
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/getCreditCard", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async creditCardEligibility(customerCreditCardId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerCreditCardId": customerCreditCardId }))
        return await this.http.post(environment.apiUrl + "/api/customer/creditCards/creditCardEligibility", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCreditCardById(customerCreditCardId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerCreditCardId": customerCreditCardId }))
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/getCreditCardById", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertRejectionReason(id: number, customerCreditCardId: number, reason: string, rejectionReason: RejectionReason[], token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "customerCreditCardId": customerCreditCardId, "reasons": rejectionReason, "reason": reason }));
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/inserUpdaterejectCreditCardOffer", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCreditCardRejectionReason(customerCreditCardId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerCreditCardId": customerCreditCardId }));
        return await this.http.post(environment.apiUrl + "/api/customer/creditCard/getCustomerCreditCardRejectionReason", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCreditCardStatuses(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/getCreditCardStatuses", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async changeCreditCardStatuses(customerCreditCardId: number, creditCardStatusId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerCreditCardId": customerCreditCardId, "creditCardStatusId": creditCardStatusId }));
        return await this.http.post(environment.apiUrl + "/api/admin/creditCard/changeCreditCardOfferStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertCreditCardOffer(customerCreditCardId: number, bankCreditCardId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "customerCreditCardId": customerCreditCardId, "bankCreditCardId": bankCreditCardId }));
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/customer/creditCards/insertUpdateCustomerCreditCardOffer", parameter, { headers: reqHeader })
            .toPromise() as any
    }


}