import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    constructor(private http: HttpClient) { }

    async getDocument(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/documentMasters/getDocumentMaster", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertDocument(name: string, maxSize: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name, "maxSize": maxSize }));
        return await this.http.post(environment.apiUrl + "/api/admin/documentMasters/insertDocumentMasters", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateDocument(id: number, name: string, maxSize: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "maxSize": maxSize }));
        return await this.http.post(environment.apiUrl + "/api/admin/documentMasters/updateDocumentMasters", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveDocument(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/documentMasters/activeInactiveDocumentMasters", parameter, { headers: reqHeader })
            .toPromise() as any;
    }


    async getServiceDocument(startIndex: number, fetchRecords: number, serviceId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "serviceId": serviceId }))
        return await this.http.post(environment.apiUrl + "/api/admin/serviceDocuments/getServiceDocuments", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertServiceDocument(serviceDocuments: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceDocuments/insertServiceDocuments", serviceDocuments, { headers: reqHeader })
            .toPromise() as any
    }

    async updateServiceDocument(serviceDocuments: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceDocuments/updateServiceDocuments", serviceDocuments, { headers: reqHeader })
            .toPromise() as any
    }

    async activeIanctiveServiceDocument(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceDocuments/activeInactiveServiceDocuments", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}