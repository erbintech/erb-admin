import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

    constructor(private http: HttpClient) { }

    async getServices(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/services/getServices", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertServices(name: string, serviceTypeId: number, serviceTypeName: string, displayName: string, description: string, iconUrl: string, colorCode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceTypeId": serviceTypeId, "serviceTypeName": serviceTypeName, "name": name, "displayName": displayName, "description": description, "iconUrl": iconUrl, "colorCode": colorCode }));
        return await this.http.post(environment.apiUrl + "/api/admin/services/insertServices", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateServices(id: number, name: string, serviceTypeId: number, serviceTypeName: string, displayName: string, description: string, iconUrl: string, colorCode: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "serviceTypeId": serviceTypeId, "serviceTypeName": serviceTypeName, "name": name, "displayName": displayName, "description": description, "iconUrl": iconUrl, "colorCode": colorCode }));
        return await this.http.post(environment.apiUrl + "/api/admin/services/updateServices", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveServices(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/services/activeInactiveServices", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}