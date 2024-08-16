import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AddressTypeService {

    constructor(private http: HttpClient) { }

    async getAddressTypes(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/addressType/getAddressTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertAddressType(name: string, description: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name , "description": description }));
        return await this.http.post(environment.apiUrl + "/api/admin/addressType/insertAddressType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateAddressType(id: number, name: string, description: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "description": description }));
        return await this.http.post(environment.apiUrl + "/api/admin/addressType/updateAddressType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveAddressType(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/addressType/activeInactiveAddressType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}