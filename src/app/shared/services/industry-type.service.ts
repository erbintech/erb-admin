import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IndustrytTypeService {

    constructor(private http: HttpClient) { }

    async getIndustryTypes(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/industryTypes/getIndustryTypes", {},{ headers: reqHeader })
            .toPromise() as any
    }

    async insertIndustryType(name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/industryTypes/insertIndustryType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateIndustryType(id: number, name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/industryTypes/updateIndustryType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveIndustryType(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/industryTypes/activeInactiveIndustryType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}