import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dsa } from '../models/dsa';

@Injectable({
    providedIn: 'root'
})
export class DsaService {

    constructor(private http: HttpClient) { }

    async getDsa(startIndex: number, fetchRecords: number, roles: string, token: string, searchString: string, status: string, badgeId: number, isDelete: boolean, fromDate: Date, toDate: Date): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "roles": roles, "searchString": searchString, "status": status, "bdgeId": badgeId, "isDelete": isDelete, "fromDate": fromDate, "toDate": toDate }));;
        return await this.http.post(environment.apiUrl + "/api/admin/dsa/getDsa", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async VerifiedDsa(id: number, userId: number, isDisabled: boolean, permanent: string, temporaryCode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "userId": userId, "isDisabled": isDisabled, "permanentCode": permanent, "temporaryCode": temporaryCode }));;
        return await this.http.post(environment.apiUrl + "/api/admin/dsa/verifiedDsa", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCityByPincode(fetchRecords: number, pincode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecords": fetchRecords, "pincode": pincode }));
        return await this.http.post(environment.apiUrl + "/api/customer/cities/getCityByPincode", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPartner(dsa: Dsa, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/partners/insertPartner", dsa, { headers: reqHeader })
            .toPromise() as any
    }

    async updatePartner(dsa: Dsa, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/partners/updatePartner", dsa, { headers: reqHeader })
            .toPromise() as any
    }

    async getPartnerDetailByPartnerId(partnerId:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "partnerId": partnerId }));
        return await this.http.post(environment.apiUrl + "/api/admin/partners/getPartnerDetailByPartnerId", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getProfessions(fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecords": fetchRecords }));
        return await this.http.post(environment.apiUrl + "/api/partner/professions/getProfessions", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getDesignations(fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecords": fetchRecords }));
        return await this.http.post(environment.apiUrl + "/api/partner/designations/getDesignations", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getEducationTypes(fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecords": fetchRecords }));
        return await this.http.post(environment.apiUrl + "/api/partner/educationTypes/getEducationTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async deletePartnerByPartnerId(id: number, partnerId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "partnerId": partnerId }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/partners/deletePartnerByPartnerId", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async changeBadge(partnerId: number, badgeId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "partnerId": partnerId, "badgeId": badgeId }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/badges/updatePartnerBadge", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async insertUpdatePartnerBankDetail(id: number, partnerId: number, accountHolderName: string, accountNo: number, ifscCode: string, bankId: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "partnerId": partnerId, "accountHolderName": accountHolderName, "accountNo": accountNo, "ifscCode": ifscCode, "bankId": bankId }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/partner/partners/insertUpdatePartnerBankDetail", parameter, { headers: reqHeader })
            .toPromise() as any;
    }
}