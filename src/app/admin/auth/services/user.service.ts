import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/UserData';
import { AuthService } from './auth.service';

const BACKEND_URL: string = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUser(userId: string): Observable<UserData> {
    return this.http.get<UserData>(BACKEND_URL + '/' + userId);
  }

  getCurrentUser():Observable<UserData>{
    return this.getUser(this.authService.getUserId());
  }
}
