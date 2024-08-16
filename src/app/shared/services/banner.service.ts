import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BannerService {

    constructor(private http: HttpClient) { }

    async getBanners(fromDate:Date, toDate:Date, isActive:any, selectedRoles:any, token: string, startIndex: number, fetchRecords: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fromDate": fromDate, "toDate": toDate, "isActive": isActive, "selectedRoles": selectedRoles, "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/banner/getBanners", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBanner(banners:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/banner/insertBanner", banners, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBanner(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/banner/activeInactiveBanner", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}