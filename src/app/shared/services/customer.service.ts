import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BecomePartner } from '../models/become-partner';
import { Customer } from '../models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private http: HttpClient) { }

    async getCustomer(startIndex: number, fetchRecords: number, customerId: number, token: string, selectedRoles?: any, searchString?: string, fromDate?: Date, toDate?: Date, isDelete?: boolean, cityIds?: any, stateIds?: any, serviceIds?: any, statusIds?: any): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "customerId": customerId, "roleIds": selectedRoles, "searchString": searchString, "fromDate": fromDate, "toDate": toDate, "isDelete": isDelete, "cityIds": cityIds, "stateIds": stateIds, "serviceIds": serviceIds, "statusIds": statusIds }))
        return await this.http.post(environment.apiUrl + "/api/admin/customers/getCustomers", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCustomerById(customerId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerId": customerId }))
        return await this.http.post(environment.apiUrl + "/api/admin/customers/getCustomerById", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertCustomer(customer: Customer, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "status": status }));
        return await this.http.post(environment.apiUrl + "/api/admin/customers/insertUpdateCustomer", customer, { headers: reqHeader })
            .toPromise() as any
    }

    async checkContactNoExist(contactNo: number, roleId: number, userId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "contactNo": contactNo, "roleId": roleId, "userId": userId }));
        return await this.http.post(environment.apiUrl + "/api/admin/customers/checkContactNoExist", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async deleteCustomerById(id: number, customerId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "customerId": customerId }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/customers/deleteCustomerById", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async getStates(token:string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/customers/getState", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getBecomePartnerRequest(token: string, searchString: string, startIndex: number, fetchRecords: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/customers/getBecomePartnerRequest", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async assignRoleToCustomer(token: string, partnerRequest: BecomePartner): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/customers/assignRoleToCustomer", partnerRequest, { headers: reqHeader })
            .toPromise() as any
    }

    async becomePartner(token: string, partnerRequest: BecomePartner): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/customers/becomePartner", partnerRequest, { headers: reqHeader })
            .toPromise() as any
    }

}
