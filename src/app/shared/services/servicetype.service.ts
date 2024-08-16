import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServicetypeService {

    constructor(private http: HttpClient) { }

    async getServicetype(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/serviceTypes/getServiceTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertServicetype(id: number, displayName: string, name: string, description: string, iconUrl: string, colorCode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "displayName": displayName, "description": description, "iconUrl": iconUrl, "colorCode": colorCode }));
        return await this.http.post(environment.apiUrl + "/api/admin/serviceTypes/insertServiceTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateServicetype(id: number, name: string, displayName: string, description: string, iconUrl: string, colorCode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "displayName": displayName, "description": description, "iconUrl": iconUrl, "colorCode": colorCode }));
        return await this.http.post(environment.apiUrl + "/api/admin/serviceTypes/updateServiceTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async removeServicetype(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceTypes/removeServiceTypes", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async activeInactiveServicetype(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceTypes/activeInactiveServiceTypes", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}