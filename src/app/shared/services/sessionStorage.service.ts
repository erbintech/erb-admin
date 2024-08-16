import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

    credential: string ='';
    sessionToken: string='';

    constructor(private http: HttpClient) { }

    getSessionToken() {
        return this.sessionToken;
    }
    setSessionToken(sessionToken: string) {
        this.sessionToken = sessionToken;
    }
    getCredential() {
        return this.credential;
    }
    setCredential(credential: string) {
        this.credential = credential;
    }
}