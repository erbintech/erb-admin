import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class  DashboardService {

    constructor(private http: HttpClient) { }

    async getDashboardData(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/dashboard/getDashboard", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getPendingApplication(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }));
        return await this.http.post(environment.apiUrl + "/api/admin/dashboard/getPendingApplication", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getDisbursedData(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }));
        return await this.http.post(environment.apiUrl + "/api/admin/dashboard/getDisbursedApplication", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getTopPerformer(startIndex: number, fetchRecords: number, selectedInterval: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "selectedInterval": selectedInterval }));
        return await this.http.post(environment.apiUrl + "/api/admin/dashboard/getTopPerformers", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getTop10Performer(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/dashboard/getTop10Performer", {}, { headers: reqHeader })
            .toPromise() as any
    }
}