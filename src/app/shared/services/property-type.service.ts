import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PropertyTypeService {

    constructor(private http: HttpClient) { }

    async getPropertyType(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/propertyType/getPropertyType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPropertyType(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/propertyType/insertPropertyType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updatePropertyType(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/propertyType/updatePropertyType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactivePropertType(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/propertyType/activeInactivePropertType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}