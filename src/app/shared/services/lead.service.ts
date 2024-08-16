import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Leads } from '../models/leads';

@Injectable({
    providedIn: 'root'
})
export class LeadService {

    constructor(private http: HttpClient) { }

    async getLeads(startIndex: number, fetchRecords: number, token: string, serviceIds = [], selectedpartner = [], leadId?: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "serviceIds": serviceIds, "partnerIds": selectedpartner, "leadId": leadId }))
        return await this.http.post(environment.apiUrl + "/api/admin/leads/getLeads", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async assignToPartner(leadId: number, partnerId:number, assignById: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "leadId": leadId, "partnerId": partnerId, "assignById": assignById }))
        return await this.http.post(environment.apiUrl + "/api/admin/leads/assignToPartner", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getPartnerForLeads(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/leads/getPartnerForLeads", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getLeadStatuses(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/leads/getLeadstatuses", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async convertLeadIntoLoan(token: string, lead: Leads): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "leadId": leadId, "customerId": customerId, "serviceId": serviceId, "employmentTypeId": employmentTypeId, "assignPartnerId": assignPartnerId, "loanAmount": loanAmount }))
        return await this.http.post(environment.apiUrl + "/api/admin/leads/convertLeadIntoLoan", lead, { headers: reqHeader })
            .toPromise() as any
    }

    async convertLeadIntoCreditCard(token: string, lead: Leads): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "leadId": leadId, "customerId": customerId, "serviceId": serviceId, "employmentTypeId": employmentTypeId, "assignPartnerId": assignPartnerId, "loanAmount": loanAmount }))
        return await this.http.post(environment.apiUrl + "/api/admin/leads/convertLeadIntoCreditCard", lead, { headers: reqHeader })
            .toPromise() as any
    }

    async changeLeadStatus(leadId: number, statusId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "leadId": leadId, "statusId": statusId }))
        return await this.http.post(environment.apiUrl + "/api/admin/leads/changeLeadStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertLead(lead: Leads, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/customer/leads/insertUpdateLeads", lead, { headers: reqHeader })
            .toPromise() as any
    }
}