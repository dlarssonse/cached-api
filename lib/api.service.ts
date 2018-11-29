import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { getName } from './api';
import { CachedAPIData } from './cache';

@Injectable()
export class CachedAPIService {
  public cacheSize = 1;
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private urls: string[];
  private cache: CachedAPIData[];
  private token: string;

  /**
   *
   */
  constructor(private http: HttpClient) {
    this.urls = new Array<string>();
    this.cache = new Array<CachedAPIData>();
    this.token = '';
  }

  /**
   * @param name
   * @param url
   */
  public addURL(item: any, url: string, custom?: string): void {
    const prototype = getName(item);
    this.urls[prototype + (custom ? (custom as any) : '')] = url;
  }

  /**
   *
   * @param token
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   *
   */
  public getToken(): string {
    return this.token;
  }

  /**
   *
   * @param item
   * @param id
   */
  public clear(item: any, id?: any) {
    const name = getName(item);
    const cacheName = (name as any) + id;
    delete this.cache[cacheName];
  }

  /**
   *
   * @param item
   */
  public put<T>(item: T): Observable<T> {
    const url = this.getURL(item, 'put');
    return this.http.put<T>(url, item, this.httpOptions).pipe(
      tap((response: T) => {
        Object.assign(response, { _className: name });
      }),
    );
  }

  /**
   *
   * @param item
   */
  public post<T>(item: T): Observable<T> {
    const url = this.getURL(item, 'post');
    return this.http.post<T>(url, item, this.httpOptions).pipe(
      tap((response: T) => {
        Object.assign(response, { _className: name });
      }),
    );
  }

  /**
   *
   * @param item
   */
  public delete<T>(item: T, id: any): Observable<T> {
    const url = this.getURL(item, 'delete') + '/' + id;
    return this.http.delete<T>(url, this.httpOptions).pipe(
      tap((response: T) => {
        Object.assign(response, { _className: name });
      }),
    );
  }

  /**
   *
   * @param item
   */
  public get<T>(item: T, id: any): Observable<T> {
    const name = getName(item);
    const cacheName = (name as any) + id;

    // Check if this is cached
    if (!this.cache[cacheName]) {
      const url = this.getURL(item, 'get') + '/' + id;
      this.cache[cacheName] = new CachedAPIData(name);
      this.cache[cacheName].setRequest(
        this.http.get<T>(url, this.httpOptions).pipe(
          tap((response: T) => {
            Object.assign(response, { _cachedAt: Date.now(), _className: name });
          }),
          shareReplay(this.cacheSize),
        ),
      );
    }

    return this.cache[cacheName].getRequest();
  }

  /**
   *
   * @param item
   * @param id
   */
  public find<T>(item: T, query?: any): Observable<T> {
    const name = getName(item);
    const cacheName = (name as any) + query;

    // Check if this is cached
    if (!this.cache[cacheName]) {
      const url = this.getURL(item, 'find') + (query ? '?' + query : '');
      this.cache[cacheName] = new CachedAPIData(name);
      this.cache[cacheName].setRequest(
        this.http.get<T[]>(url, this.httpOptions).pipe(
          tap((responses: T[]) => {
            if (responses) {
              const time = Date.now();
              if (responses.length) {
                responses.forEach(response => {
                  Object.assign(response, { _cachedAt: time, _className: name });
                });
              } else {
                Object.assign(responses, { _cachedAt: time, _className: name });
              }
            }
          }),
          shareReplay(this.cacheSize),
        ),
      );
    }

    return this.cache[cacheName].getRequest();
  }

  /**
   *
   * @param item
   * @param name
   */
  private getURL<T>(item: T, type: string): any {
    const name = getName(item);
    if (name) {
      if (this.urls[name + (type as any)]) {
        return this.urls[name + (type as any)];
      } else if (this.urls[name]) {
        return this.urls[name];
      }
    }

    throw new Error(
      "No URL found for '" + type + ':' + name + "'. Did you include _className in your class definition?",
    );
  }
}
