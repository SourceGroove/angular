import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {MatOAuthSecurityService, OAuthToken} from 'projects/mat-oauth-security/src/lib/mat-oauth-security.service';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';

@Injectable()
export class MatOAuthSecurityInterceptor implements HttpInterceptor {
  tokenSubject: Subject<OAuthToken> = new Subject<OAuthToken>();
  refreshing: boolean;

  constructor(private authenticationService: MatOAuthSecurityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(this.secure(this.authenticationService.token, request))
      .pipe(
        catchError(e => this.isExpiredTokenError(e) ? this.handleExpiredToken(request, next) : this.handleError(e))
      );
  }

  handleExpiredToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this.refreshing) {
      return this.tokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => next.handle(this.secure(token, req))));
    } else {
      this.refreshing = true;
      this.tokenSubject.next(null);
      return this.authenticationService
        .refresh()
        .pipe(
          switchMap(token => {
            if (token) {
              this.tokenSubject.next(token);
              return next.handle(this.secure(token, req));
            }
            this.authenticationService.logout();
            return throwError('Error refreshing session, login required');
          }),
          catchError(err => {
            this.authenticationService.logout();
            return this.handleError(err);
          }),
          finalize(() => this.refreshing = false)
        );
    }
  }


  private handleError(error: HttpErrorResponse) {
    const status: number = error.hasOwnProperty('status') ? error.status : 0;
    let message: string;

    if (error.error instanceof ErrorEvent) {
      message = error.error.message;

    } else if (error.error != null && error.error.hasOwnProperty('error_description')) {
      message = error.error.error_description;

    } else if (error.error != null && error.error.hasOwnProperty('error')) {
      message = error.error.error;
    }

    if (status === 0) {
      return throwError('Connection error - please try again');

    } else if (status === 403) {
      return throwError('Access denied');

    } else if (status === 400 || status === 404) {
      return throwError(error.error);

    } else {
      return throwError(`${message}`);
    }

  }

  private secure(token: OAuthToken, request: HttpRequest<any>): HttpRequest<any> {
    if (request.url.indexOf('auth/oauth/token') > 0){
      return request;
    }
    let headers: HttpHeaders = new HttpHeaders().append('X-Requested-With', 'XMLHttpRequest');
    if (token != null && token.accessToken != null) {
      headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    }
    return request.clone({withCredentials: true, headers});
  }

  private isExpiredTokenError(err: any){
    return err instanceof HttpErrorResponse
      && err.status === 401
      && err.error.hasOwnProperty('error_description')
      && err.error.error_description.startsWith('Access token expired');
  }
}
