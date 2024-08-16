import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessExperienceService {

    constructor(private http: HttpClient) { }

    async getBusinessExperience(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/businessExperience/getBusinessExperience", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBusinessExperience(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessExperience/insertBusinessExperience", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBusinessExperience(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessExperience/updateBusinessExperience", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBusinessExperience(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessExperience/activeInactiveBusinessExperience", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}