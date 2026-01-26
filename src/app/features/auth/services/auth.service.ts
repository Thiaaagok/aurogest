import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { Config } from '../../common/config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;

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
        })
      );
  }

  refresh() {
    const refreshToken = localStorage.getItem('refresh_token');

    return this.http
      .post<any>('https://localhost:3000/auth/refresh', {
        refreshToken,
      })
      .pipe(tap((res) => (this.accessToken = res.accessToken)));
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }
}
