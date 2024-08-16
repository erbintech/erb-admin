import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CoApplicantRelationService {

    constructor(private http: HttpClient) { }

    async getCoApplicantRelation(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/coApplicantRelation/getCoApplicantRelation", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertCoApplicantRelation(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/coApplicantRelation/insertCoApplicantRelation", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateCoApplicantRelation(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/coApplicantRelation/updateCoApplicantRelation", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveCoApplicantRelation(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/coApplicantRelation/activeInactiveCoApplicantRelation", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}