import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FaqsService {

    constructor(private http: HttpClient) { }

    async getFaqCategories(startIndex: number, fetchRecords: number, startIndexFaqs: number, fetchRecordFaqs: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "startIndexFaqs": startIndexFaqs, "fetchRecordFaqs": fetchRecordFaqs }))
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/getFaqCategories", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateFaqCategories(categoryId: number, categoryName: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "categoryId": categoryId, "categoryName": categoryName }));
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/insertUpdateFaqCategories", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getFaqs(faqCategoryId: number, startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ faqCategoryId: faqCategoryId, "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/getFaqs", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUpdateFaqs(id: number, faqType: number, faqCategoryId: number, question: string, answer: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "faqType": faqType, "faqCategoryId": faqCategoryId, "question": question, "answer": answer }));
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/insertUpdateFaqs", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getFaqType(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({"fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/getFaqType", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveFaqs(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/activeInactiveFaqs", parameter, { headers: reqHeader }).toPromise() as any;
    }

    async activeInactiveFaqsCategories(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/faqs/activeInactiveFaqsCategories", parameter, { headers: reqHeader }).toPromise() as any;
    }

}