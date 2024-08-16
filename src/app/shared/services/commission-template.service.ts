import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { commissionTemplate } from '../models/commissionTemplate';

@Injectable({
    providedIn: 'root'
})
export class CommissionTemplateService {

    constructor(private http: HttpClient) { }

    async getCommissionTemplate(startIndex: number, fetchRecords: number, bankIds:any, serviceIds:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankIds": bankIds, "serviceIds": serviceIds }))
        return await this.http.post(environment.apiUrl + "/api/admin/commissionTemplates/getCommissionTemplate", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    // async insertUpdateCommissionTemplate(templateId: number, commissionTypeId: number, commission: number, name: string, bankId: any, serviceId: any, bankLoanCommissionId: number, token: string): Promise<any> {
    //     let reqHeader = new HttpHeaders({ "Authorization": token });
    //     let parameter = JSON.parse(JSON.stringify({ "commissionTypeId": commissionTypeId, "commission": commission, "id": templateId, "name": name, "bankId": bankId, "serviceId": serviceId, "bankLoanCommissionId": bankLoanCommissionId }))
    //     return await this.http.post(environment.apiUrl + "/api/admin/commissionTemplates/insertUpdateCommissionTemplate", parameter, { headers: reqHeader })
    //         .toPromise() as any
    // }

    async insertUpdateCommissionTemplate(commissionTemplate: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/commissionTemplates/insertUpdateCommissionTemplate", commissionTemplate, { headers: reqHeader })
            .toPromise() as any
    }

}