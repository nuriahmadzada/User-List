import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})

export class AuthService {
    private adminApiUrl: string = environment.apiUrl;
    private Header: HttpHeaders;
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    public currentUserSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<string>(
            localStorage.getItem("token")
        );
        this.currentUser = this.currentUserSubject.asObservable();
        this.Header = new HttpHeaders({
            Authorization: "Bearer " + localStorage.getItem("token") || "",
            "Content-Type": "application/json"
        });
        if (this.currentUserValue != null) {
            this.loggedIn.next(true);
        }
    }
    public get currentUserValue(): string {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        this.Header = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return this.http.post<any>(
            this.adminApiUrl + `login`, { email, password },
            { headers: this.Header, observe: "response" }
        )
            .pipe(
                map(data => {
                    if (data.body && data.body.token) {
                        localStorage.setItem("token", data.body.token);
                        localStorage.setItem("name", email);
                        this.currentUserSubject.next(data.body.token);
                        this.loggedIn.next(true);
                    }
                    return data;
                })
            );
    }

    register(email: string, password: string){
        this.Header = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return this.http.post<any>(
            this.adminApiUrl + `register`, { email, password },
            { headers: this.Header, observe: "response" }
        )
            .pipe(
                map(data => {
                    if (data.body && data.body.token) {
                        localStorage.setItem("token", data.body.token);
                        this.currentUserSubject.next(data.body.token);
                        this.loggedIn.next(true);
                    }
                    return data;
                })
            );
    }
}