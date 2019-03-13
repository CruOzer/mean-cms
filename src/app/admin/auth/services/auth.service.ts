import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { AuthData } from '../AuthData';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { ServerMessage } from '../../models/ServerMessage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { SuccessLoginData } from '../models/SuccessLoginData';

const BACKEND_URL: string = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token: string;
  private tokenTimer: any;
  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private flashMsg: FlashMessagesService,
  ) {}

  createUser(authData: AuthData) {
    this.http.post(BACKEND_URL + '/register', authData).subscribe(
      (msg: ServerMessage) => {
        this.flashMsg.show('You are now registered and can log in', {
          cssClass: 'alert-success',
          timeout: 4000
        });
        this.router.navigate(['/auth/login']);
      },
      (error: ServerMessage) => {
        this.flashMsg.show('Error while registering: ' + error.message, {
          cssClass: 'alert-danger',
          timeout: 4000
        });
        this.authStatusListener.next(false);
      }
    );
  }

  login(authData: AuthData) {

    console.log(BACKEND_URL);
    this.http
      .post<SuccessLoginData>(BACKEND_URL + '/login', authData)
      .subscribe(
        (response: SuccessLoginData) => {

    console.log('response');
          if (response.success) {
            this.token = response.token;
            const expiresInDuration = response.expiresIn;
            this.setAuthTime(expiresInDuration);
            this.setAuthentication(true);
            this.userId = response.user.id;
            // Save Data
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate, this.userId);
            this.flashMsg.show('You are now logged in.', {
              cssClass: 'alert-success',
              timeout: 4000
            });
            this.router.navigate(['/']);
          }
        },
        (error: ServerMessage) => {
          console.log(error);

          this.flashMsg.show('Error while authenticating: ' + error.message, {
            cssClass: 'alert-danger',
            timeout: 4000
          });
          this.setAuthentication(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.setAuthentication(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.flashMsg.show('You are now logged out.', {
      cssClass: 'alert-success',
      timeout: 4000
    });
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const info: {
      token: string;
      expirationDate: Date;
      userId: string;
    } = this.getAuthData();
    if (!info) {
      return;
    }
    const now = new Date();
    const expiresIn = info.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = info.token;
      this.userId = info.userId;
      this.setAuthTime(expiresIn / 1000);
      this.setAuthentication(true);
    }
  }

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private setAuthTime(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private setAuthentication(auth: boolean) {
    this.isAuthenticated = auth;
    this.authStatusListener.next(auth);
  }

  private getAuthData(): {
    token: string;
    expirationDate: Date;
    userId: string;
  } {
    const token = localStorage.getItem('tokenMeanCourse');
    const userId = localStorage.getItem('userMeanCourse');
    const expirationDate = localStorage.getItem('expirationMeanCourse');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate)
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('tokenMeanCourse', token);
    localStorage.setItem('expirationMeanCourse', expirationDate.toISOString());
    localStorage.setItem('userMeanCourse', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('tokenMeanCourse');
    localStorage.removeItem('expirationMeanCourse');
    localStorage.removeItem('userMeanCourse');
  }
}
