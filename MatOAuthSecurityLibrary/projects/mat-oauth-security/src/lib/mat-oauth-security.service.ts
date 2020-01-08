import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {shareReplay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatOAuthSecurityService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  get loggedIn(): boolean {
    return this.token != null;
  }
  get username(): string {
    return this.token != null ? this.token.username : null;
  }
  get roles(): string[] {
    return this.token != null ? this.token.roles : [];
  }
  get permissions(): Permission[] {
    return this.token != null ? this.token.permissions : [];
  }
  get token(): OAuthToken {
    const t = JSON.parse(sessionStorage.getItem('token'));
    return t != null ? new OAuthToken(t) : null;
  }
  set token(token: OAuthToken) {
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  public write(feature: string): boolean {
    const permission: Permission = this.getPermissionForFeature(feature);
    return permission != null && permission.accessLevel === 'RW';
  }
  public read(feature: string): boolean {
    const permission: Permission = this.getPermissionForFeature(feature);
    return permission != null && (permission.accessLevel === 'R' || permission.accessLevel === 'RW');
  }
  public denied(feature: string): boolean {
    const permission: Permission = this.getPermissionForFeature(feature);
    return permission == null || this.getPermissionForFeature(feature).accessLevel === 'DENIED';
  }
  public getPermissionForFeature(feature: string): Permission {
    return this.permissions.find(p => p.feature === feature);
  }
  public login(username: string, password: string): Observable<OAuthToken> {
    const params: HttpParams = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);
    return this.getToken(params).pipe(shareReplay(1));
  }
  public refresh(): Observable<OAuthToken> {
    const refreshToken: string = this.token.refreshToken;
    const params: HttpParams = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);
    return this.getToken(params).pipe(shareReplay(1));
  }
  public logout(redirectUrl?: string): void {
    sessionStorage.clear();
    const url: string = redirectUrl ? '/login?redirectUrl=' + redirectUrl : '/login';
    this.router.navigateByUrl(url, {replaceUrl: true});
  }
  private getToken(params: HttpParams): Observable<OAuthToken> {
    const h = new HttpHeaders();
    h.append('Accept', '*/*');
    h.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient
      .post<OAuthToken>('auth/oauth/token', params, {headers: h})
      .pipe(
        tap(t => this.token = t)
      );
  }
}

export class Permission {
  feature: string;
  accessLevel: string;
  roleId: string;
  constructor(obj?: any) {
    this.feature = obj.feature;
    this.accessLevel = obj.accessLevel;
    this.roleId = obj.roleId;
  }
}
export class OAuthToken {
  username: string;
  roles: string[];
  permissions: Permission[];
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
  jti: string;

  constructor(obj?: any) {
    this.username = obj.username;
    this.roles = obj.roles;
    this.accessToken = obj.access_token;
    this.refreshToken = obj.refresh_token;
    this.expiresIn = obj.expires_in;
    this.tokenType = obj.token_type;
    this.scope = obj.scope;
    this.jti = obj.jti;
    this.permissions = obj.permissions != null ? obj.permissions.map(p => new Permission(p)) : [];
  }
}
