import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResidenceTypeService {

    constructor(private http: HttpClient) { }

    async getResidentTypes(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/residentTypes/getResidentTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertResidentType(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/residentTypes/insertResidentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateResidentType(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/residentTypes/updateResidentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveResidentType(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/residentTypes/activeInactiveResidentType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}