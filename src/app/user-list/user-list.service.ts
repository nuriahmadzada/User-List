import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private Header: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  getUserList(page: any) {
    return this.httpClient.get<any>(environment.apiUrl + `users?page=${page}`, {
      observe: 'response',
    });
  }

  // getSingleUser(id: number){
  //   return this.httpClient.get<any>(environment.apiUrl + `users/${id}`, {
  //     observe: 'response',
  //   });
  // }

  createUser(data: any) {
    return this.httpClient.post<any>(environment.apiUrl + `users`, data, {
      observe: 'response',
    });
  }

  editUser(id: number, data: any) {
    return this.httpClient.put<any>(environment.apiUrl + `users/${id}`, data, {
      observe: 'response',
    });
  }

  deleteUser(id: number) {
    return this.httpClient.delete<any>(environment.apiUrl + `users/${id}`, {
      observe: 'response',
    });
  }

}
