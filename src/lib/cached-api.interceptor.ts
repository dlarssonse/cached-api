import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CachedAPIService } from './cached-api.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  /**
   *
   * @param apiService
   */
  constructor(public apiService: CachedAPIService) {}

  /**
   *
   * @param request
   * @param next
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.apiService.getToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.apiService.getToken()}`,
        },
      });
    }
    return next.handle(request);
  }
}
