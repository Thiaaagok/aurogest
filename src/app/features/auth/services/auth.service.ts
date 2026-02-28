import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { Config } from '../../common/config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private readonly apiUrl = `${Config.APIURL}/auth`;

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.accessToken);
          localStorage.setItem('refresh_token', res.refreshToken);

          const decoded: any = jwtDecode(res.accessToken);
          localStorage.setItem('token_exp', decoded.exp.toString());
        }),
      );
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.accessToken);

          const decoded: any = jwtDecode(res.accessToken);
          localStorage.setItem('token_exp', decoded.exp.toString());
        }),
      );
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_exp');
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const exp = localStorage.getItem('token_exp');
    if (!exp) return false;

    return Date.now() < Number(exp) * 1000;
  }
}
